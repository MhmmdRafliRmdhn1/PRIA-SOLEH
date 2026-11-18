import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { HALL } from '../../../config/layout';
import { mergeParts } from '../../../utils/mergeGeo';
import { useHallMaterials } from './materials';

/** Geometri kubah (tutup bola) dihitung dari radius aula & tinggi kubah. */
function domeParams() {
  const R = HALL.radius;
  const rise = HALL.domeRise;
  const Rs = (R * R + rise * rise) / (2 * rise);
  const cy = HALL.wallHeight + rise - Rs; // pusat bola
  const thetaMax = Math.asin(R / Rs);
  const oculusR = 5.6;
  const thetaMin = Math.asin(oculusR / Rs);
  return { Rs, cy, thetaMax, thetaMin, oculusR };
}

const SHAFT_VERT = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewDir = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const SHAFT_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewDir;
  void main() {
    // vUv.y: 0 = bawah (lantai), 1 = atas (skylight)
    float along = pow(vUv.y, 1.6);
    float edge = pow(abs(dot(normalize(vNormalW), normalize(vViewDir))), 1.4);
    float shimmer = 0.9 + 0.1 * sin(uTime * 0.6 + vUv.x * 12.0);
    float a = along * edge * 0.2 * shimmer;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

export const Dome: React.FC = () => {
  const mats = useHallMaterials();
  const p = useMemo(domeParams, []);

  const ribs = useMemo(() => {
    const parts = [];
    const count = 24;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 18; i++) {
      const th = p.thetaMin + ((p.thetaMax - p.thetaMin) * i) / 18;
      pts.push(new THREE.Vector3((p.Rs - 0.08) * Math.sin(th), (p.Rs - 0.08) * Math.cos(th) + p.cy, 0));
    }
    const curve = new THREE.CatmullRomCurve3(pts);
    const base = new THREE.TubeGeometry(curve, 36, 0.09, 6, false);
    for (let i = 0; i < count; i++) {
      parts.push({ geo: base.clone().rotateY((i / count) * Math.PI * 2) });
    }
    base.dispose();
    return mergeParts(parts);
  }, [p]);

  const rings = useMemo(() => {
    const ringAt = (th: number, tube: number) => {
      const r = (p.Rs - 0.08) * Math.sin(th);
      const y = (p.Rs - 0.08) * Math.cos(th) + p.cy;
      return new THREE.TorusGeometry(r, tube, 8, 160).rotateX(Math.PI / 2).translate(0, y, 0);
    };
    return mergeParts(
      [0.2, 0.3, 0.41, 0.5].map((t) => ({ geo: ringAt(t, 0.07) }))
        .concat([{ geo: ringAt(p.thetaMax - 0.004, 0.12) }])
    );
  }, [p]);

  const ledRings = useMemo(() => {
    const ringAt = (th: number) => {
      const r = (p.Rs - 0.1) * Math.sin(th);
      const y = (p.Rs - 0.1) * Math.cos(th) + p.cy;
      return new THREE.TorusGeometry(r, 0.035, 6, 160).rotateX(Math.PI / 2).translate(0, y, 0);
    };
    return mergeParts([0.25, 0.355, 0.455].map((t) => ({ geo: ringAt(t) })));
  }, [p]);

  const apexY = p.Rs * Math.cos(p.thetaMin) + p.cy;
  const shaftUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color('#fff1c9') } }),
    []
  );
  const shaftRef = useRef<THREE.ShaderMaterial>(null);
  useFrame((s) => {
    shaftUniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <group>
      {/* Permukaan kubah */}
      <mesh position={[0, p.cy, 0]} receiveShadow>
        <sphereGeometry args={[p.Rs, 160, 28, 0, Math.PI * 2, p.thetaMin, p.thetaMax - p.thetaMin]} />
        <meshStandardMaterial
          color="#fffdf8"
          emissive="#fffaf0"
          emissiveIntensity={0.85}
          roughness={0.55}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh geometry={ribs} material={mats.whiteSatin} />
      <mesh geometry={rings} material={mats.gold} />
      <mesh geometry={ledRings} material={mats.led} />

      {/* Bingkai oculus (skylight) */}
      <mesh position={[0, apexY, 0]} rotation-x={Math.PI / 2} material={mats.gold}>
        <torusGeometry args={[p.oculusR, 0.22, 12, 120]} />
      </mesh>
      {/* Kaca skylight bercahaya */}
      <mesh position={[0, apexY + 0.15, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[p.oculusR, 64]} />
        <meshBasicMaterial color="#fffaf0" toneMapped={false} />
      </mesh>

      {/* Berkas cahaya dari skylight ke plaza */}
      <mesh position={[0, apexY / 2, 0]}>
        <cylinderGeometry args={[p.oculusR * 0.92, 7.4, apexY, 48, 1, true]} />
        <shaderMaterial
          ref={shaftRef}
          uniforms={shaftUniforms}
          vertexShader={SHAFT_VERT}
          fragmentShader={SHAFT_FRAG}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
};
