import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { GLOBE, ZONES } from '../../../config/layout';
import { QUALITY } from '../../../config/quality';
import { getIslandGeo, ISLAND_MASK_ORDER } from '../../../data/geo';
import { ISLANDS } from '../../../data/islands';
import type { IslandId } from '../../../data/types';
import { museum, zoneEnergy } from '../../../state/museumStore';
import { lonLatToDirection } from '../../../utils/geoMath';
import { createGlobeTextures } from './globeTextures';
import { ATMOS_FRAG, ATMOS_VERT, GLOBE_FRAG, GLOBE_VERT } from './globeShaders';
import { GlobeDirector } from './globeDirector';

const Z_AXIS = new THREE.Vector3(0, 0, 1);
const Y_AXIS = new THREE.Vector3(0, 1, 0);

/** Penanda emas di permukaan globe untuk tiap pulau (cincin + tiang cahaya), membesar saat jadi target. */
const IslandMarkers: React.FC<{ markerRefs: React.MutableRefObject<Record<string, THREE.Group | null>> }> = ({ markerRefs }) => {
  const R = GLOBE.radius;
  const items = useMemo(
    () =>
      ISLAND_MASK_ORDER.map((id) => {
        const [lon, lat] = ISLANDS[id].focus ?? getIslandGeo(id).centroid;
        const dir = lonLatToDirection(lon, lat);
        const q = new THREE.Quaternion().setFromUnitVectors(Z_AXIS, dir);
        const qPole = new THREE.Quaternion().setFromUnitVectors(Y_AXIS, dir);
        return { id, dir, q, qPole };
      }),
    []
  );
  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffd24a',
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        side: THREE.DoubleSide
      }),
    []
  );
  return (
    <>
      {items.map((it) => (
        <group
          key={it.id}
          ref={(g) => {
            markerRefs.current[it.id] = g;
          }}
          scale={0.0001}
        >
          <mesh position={it.dir.clone().multiplyScalar(R * 1.01)} quaternion={it.q} material={mat}>
            <ringGeometry args={[R * 0.12, R * 0.145, 48]} />
          </mesh>
          <mesh position={it.dir.clone().multiplyScalar(R * 1.28)} quaternion={it.qPole} material={mat}>
            <cylinderGeometry args={[R * 0.008, R * 0.008, R * 0.5, 6]} />
          </mesh>
        </group>
      ))}
    </>
  );
};

export const IndonesiaGlobe: React.FC = () => {
  const R = GLOBE.radius;
  const root = useRef<THREE.Group>(null);
  const rotor = useRef<THREE.Group>(null);
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const particles = useRef<THREE.Points>(null);
  const markerRefs = useRef<Record<string, THREE.Group | null>>({});
  const director = useMemo(() => {
    const d = new GlobeDirector();
    if (import.meta.env.DEV) {
      const f = new URLSearchParams(window.location.search).get('globe');
      if (f && f in ISLANDS) d.forced = f as IslandId;
    }
    return d;
  }, []);
  const hi = useRef<number[]>([0, 0, 0, 0, 0]);

  const textures = useMemo(() => createGlobeTextures(), []);
  useEffect(
    () => () => {
      textures.world.dispose();
      textures.region.dispose();
      textures.mask.dispose();
    },
    [textures]
  );

  const uniforms = useMemo(
    () => ({
      uWorld: { value: textures.world },
      uRegion: { value: textures.region },
      uMask: { value: textures.mask },
      uTime: { value: 0 },
      uHi: { value: [0, 0, 0, 0, 0] },
      uOcean: { value: new THREE.Color('#e2c98a') },
      uOceanDeep: { value: new THREE.Color('#c29a45') },
      uLand: { value: new THREE.Color('#fffdf6') },
      uIndo: { value: new THREE.Color('#ffe9a8') },
      uGold: { value: new THREE.Color('#d9a82a') },
      uGoldBright: { value: new THREE.Color('#ff9a00') },
      uRim: { value: new THREE.Color('#fff7dd') }
    }),
    [textures]
  );
  const atmosUniforms = useMemo(
    () => ({ uColor: { value: new THREE.Color('#ffd978') }, uTime: { value: 0 } }),
    []
  );

  const particleGeo = useMemo(() => {
    const n = QUALITY.particles;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const r = R * (1.3 + Math.random() * 0.45);
      const s = Math.sqrt(1 - u * u);
      arr[i * 3] = r * s * Math.cos(t);
      arr[i * 3 + 1] = r * u * 0.8;
      arr[i * 3 + 2] = r * s * Math.sin(t);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return g;
  }, [R]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    if (!rotor.current || !root.current) return;

    if (director.update(rotor.current, dt)) {
      museum.setGlobeTarget(director.current);
    }

    // highlight halus per pulau
    const arr = hi.current;
    ISLAND_MASK_ORDER.forEach((id, i) => {
      const goal = director.current === id ? 1 : 0;
      arr[i] += (goal - arr[i]) * (1 - Math.exp(-2.6 * dt));
      uniforms.uHi.value[i] = arr[i];
      zoneEnergy[id as IslandId] = arr[i];
      const m = markerRefs.current[id];
      if (m) {
        const s = arr[i] * (1 + 0.1 * Math.sin(t * 3));
        m.scale.setScalar(Math.max(0.0001, s));
      }
    });
    uniforms.uTime.value = t;
    atmosUniforms.uTime.value = t;

    // melayang
    root.current.position.y = GLOBE.position[1] + Math.sin(t * 0.8) * 0.12;
    if (ring1.current) ring1.current.rotation.z += dt * 0.25;
    if (ring2.current) ring2.current.rotation.z -= dt * 0.18;
    if (particles.current) particles.current.rotation.y += dt * 0.05;
  });

  return (
    <group ref={root} position={GLOBE.position}>
      <group ref={rotor}>
        <mesh>
          <sphereGeometry args={[R, 96, 64]} />
          <shaderMaterial uniforms={uniforms} vertexShader={GLOBE_VERT} fragmentShader={GLOBE_FRAG} />
        </mesh>
        <IslandMarkers markerRefs={markerRefs} />
      </group>

      {/* selubung cahaya hologram */}
      <mesh scale={1.07}>
        <sphereGeometry args={[R, 48, 32]} />
        <shaderMaterial
          uniforms={atmosUniforms}
          vertexShader={ATMOS_VERT}
          fragmentShader={ATMOS_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* cincin orbit emas */}
      <mesh ref={ring1} rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[R * 1.32, R * 0.006, 8, 160]} />
        <meshBasicMaterial color="#e8b72e" toneMapped={false} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 1.7, -0.5, 0]}>
        <torusGeometry args={[R * 1.45, R * 0.004, 8, 160]} />
        <meshBasicMaterial color="#f5d56e" toneMapped={false} transparent opacity={0.8} />
      </mesh>

      <points ref={particles} geometry={particleGeo}>
        <pointsMaterial
          color="#ffd873"
          size={0.045}
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>

      <pointLight color="#ffe3a0" intensity={60} distance={16} decay={2} />
    </group>
  );
};
