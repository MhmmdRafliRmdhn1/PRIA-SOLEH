import { MASK_STEP } from './globeTextures';
import { REGION } from '../../../data/geo';

export const GLOBE_VERT = /* glsl */ `
  varying vec3 vObjPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;
  void main() {
    vObjPos = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

export const GLOBE_FRAG = /* glsl */ `
  precision highp float;
  uniform sampler2D uWorld;
  uniform sampler2D uRegion;
  uniform sampler2D uMask;
  uniform float uTime;
  uniform float uHi[5];
  uniform vec3 uOcean;
  uniform vec3 uOceanDeep;
  uniform vec3 uLand;
  uniform vec3 uIndo;
  uniform vec3 uGold;
  uniform vec3 uGoldBright;
  uniform vec3 uRim;
  varying vec3 vObjPos;
  varying vec3 vWorldNormal;
  varying vec3 vViewDir;
  varying vec3 vWorldPos;

  const float PI = 3.14159265359;
  const vec4 REGION = vec4(${REGION.lon0}.0, ${REGION.lat0}.0, ${REGION.lon1}.0, ${REGION.lat1}.0);
  const float STEP = ${MASK_STEP}.0;

  void main() {
    vec3 n = normalize(vObjPos);
    float lon = atan(-n.z, n.x);
    float lat = asin(clamp(n.y, -1.0, 1.0));
    float lonD = degrees(lon);
    float latD = degrees(lat);

    float worldLand = texture2D(uWorld, vec2(lon / (2.0 * PI) + 0.5, lat / PI + 0.5)).r;

    vec2 ruv = vec2((lonD - REGION.x) / (REGION.z - REGION.x), (latD - REGION.y) / (REGION.w - REGION.y));
    vec2 e = smoothstep(vec2(0.0), vec2(0.04), ruv) * (1.0 - smoothstep(vec2(0.96), vec2(1.0), ruv));
    float inR = e.x * e.y;
    vec3 rg = texture2D(uRegion, clamp(ruv, 0.0, 1.0)).rgb;

    float land = mix(worldLand * 0.6, rg.r, inR);
    float indo = rg.g * inR;

    // id pulau dari mask (nearest) dengan toleransi terhadap piksel tepi
    float m = texture2D(uMask, clamp(ruv, 0.0, 1.0)).r * 255.0;
    float idf = floor(m / STEP + 0.5);
    float valid = step(abs(m - idf * STEP), 9.0) * step(0.5, idf) * step(inR, 1.01) * step(0.01, inR);
    float hi = 0.0;
    for (int i = 0; i < 5; i++) {
      if (abs(float(i + 1) - idf) < 0.5) hi = uHi[i];
    }
    hi *= valid * smoothstep(0.25, 0.6, land);

    // samudra: gradien lembut berdasarkan lintang
    vec3 col = mix(uOceanDeep, uOcean, 0.55 + 0.45 * cos(lat * 1.2));

    // graticule tiap 10 derajat
    vec2 g = vec2(lonD, latD) / 10.0;
    vec2 gw = fwidth(g) * 1.3;
    vec2 gl = abs(fract(g - 0.5) - 0.5) / max(gw, vec2(1e-4));
    float grid = 1.0 - min(min(gl.x, gl.y), 1.0);
    col = mix(col, uGold, grid * 0.28 * (1.0 - land));

    // daratan
    vec3 landCol = mix(uLand, uIndo, indo * 0.9);
    col = mix(col, landCol, land);

    // garis pantai bercahaya
    float coast = smoothstep(0.2, 0.5, land) * (1.0 - smoothstep(0.5, 0.85, land));
    col += uGold * coast * (0.25 + 0.35 * indo);

    // highlight emas pulau tujuan
    float pulse = 0.88 + 0.12 * sin(uTime * 2.6 + lonD * 0.7);
    vec3 goldHi = uGoldBright * pulse;
    col = mix(col, goldHi, hi);
    col += goldHi * hi * 0.3;

    // efek hologram: fresnel + scanline + sapuan cahaya
    float fres = pow(1.0 - clamp(dot(normalize(vWorldNormal), normalize(vViewDir)), 0.0, 1.0), 2.3);
    col = mix(col, uRim, fres * 0.5);
    col += uRim * fres * 0.25;
    float scan = 0.5 + 0.5 * sin(vWorldPos.y * 90.0 - uTime * 3.5);
    col *= 0.95 + 0.05 * scan;
    float sf = fract(vWorldPos.y * 0.16 - uTime * 0.09);
    float sweep = smoothstep(0.46, 0.5, sf) * (1.0 - smoothstep(0.5, 0.54, sf));
    col += uGold * sweep * 0.05;

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

export const ATMOS_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
export const ATMOS_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float d = clamp(abs(dot(normalize(vN), normalize(vV))), 0.0, 1.0);
    float f = pow(1.0 - d, 3.2);
    float a = clamp(f * (0.85 + 0.15 * sin(uTime * 1.4)), 0.0, 1.0);
    gl_FragColor = vec4(uColor * a, a);
  }
`;
