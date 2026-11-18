import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { playerState } from '../../../state/playerState';
import { UNIFORM } from './avatarConfig';

/**
 * Avatar mahasiswa prosedural (placeholder rapi, bisa diganti GLB).
 * Hierarki sendi: pinggul → paha → lutut → kaki, bahu → lengan atas → siku → tangan.
 * Animasi idle / walking / running dihitung dari kecepatan di playerState.
 */

const cap = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 6, 14);

export const StudentRig: React.FC = () => {
  const g = useMemo(
    () => ({
      thigh: cap(0.078, 0.26),
      shin: cap(0.062, 0.3),
      upperArm: cap(0.053, 0.22),
      foreArm: cap(0.047, 0.2),
      hand: new THREE.SphereGeometry(0.045, 12, 10),
      head: new THREE.SphereGeometry(0.115, 24, 18),
      hairCap: new THREE.SphereGeometry(0.123, 24, 14, 0, Math.PI * 2, 0, Math.PI * 0.56),
      neck: new THREE.CylinderGeometry(0.045, 0.05, 0.1, 12),
      torso: new THREE.CylinderGeometry(0.175, 0.15, 0.5, 24),
      hem: new THREE.CylinderGeometry(0.152, 0.152, 0.05, 24),
      shoulder: new THREE.SphereGeometry(0.062, 14, 10),
      collar: new THREE.TorusGeometry(0.062, 0.022, 8, 20),
      pelvis: new THREE.CylinderGeometry(0.15, 0.155, 0.2, 20),
      shoe: new THREE.BoxGeometry(0.105, 0.075, 0.27),
      sole: new THREE.BoxGeometry(0.11, 0.025, 0.28),
      eye: new THREE.SphereGeometry(0.014, 8, 6),
      zip: new THREE.BoxGeometry(0.012, 0.44, 0.012),
      patch: new THREE.BoxGeometry(0.075, 0.075, 0.006)
    }),
    []
  );
  const m = useMemo(
    () => ({
      jacket: new THREE.MeshStandardMaterial({ color: UNIFORM.jacket, roughness: 0.62 }),
      jacketShade: new THREE.MeshStandardMaterial({ color: UNIFORM.jacketShade, roughness: 0.65 }),
      trim: new THREE.MeshStandardMaterial({ color: UNIFORM.trim, roughness: 0.6 }),
      pants: new THREE.MeshStandardMaterial({ color: UNIFORM.pants, roughness: 0.75 }),
      shoe: new THREE.MeshStandardMaterial({ color: UNIFORM.shoe, roughness: 0.5 }),
      sole: new THREE.MeshStandardMaterial({ color: UNIFORM.sole, roughness: 0.8 }),
      skin: new THREE.MeshStandardMaterial({ color: UNIFORM.skin, roughness: 0.55 }),
      hair: new THREE.MeshStandardMaterial({ color: UNIFORM.hair, roughness: 0.7 }),
      eye: new THREE.MeshBasicMaterial({ color: '#15110f' }),
      zip: new THREE.MeshStandardMaterial({ color: '#d8d8d8', metalness: 0.8, roughness: 0.3 }),
      // Patch dada polos: slot untuk logo resmi (belum tersedia, sengaja tidak dikarang).
      patch: new THREE.MeshStandardMaterial({ color: '#8a0d12', roughness: 0.7 })
    }),
    []
  );

  const body = useRef<THREE.Group>(null);
  const spine = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const legs = useRef<{ hip: THREE.Group | null; knee: THREE.Group | null }[]>([
    { hip: null, knee: null },
    { hip: null, knee: null }
  ]);
  const arms = useRef<{ sh: THREE.Group | null; el: THREE.Group | null }[]>([
    { sh: null, el: null },
    { sh: null, el: null }
  ]);
  const phase = useRef(0);
  const blend = useRef(0); // 0 idle → 0.5 jalan → 1 lari

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const goal = !playerState.moving ? 0 : playerState.running ? 1 : 0.5;
    blend.current += (goal - blend.current) * (1 - Math.exp(-9 * dt));
    const b = blend.current;
    const move = Math.min(1, b * 2); // 0..1 intensitas gerak
    const run = Math.max(0, (b - 0.5) * 2); // 0..1 lari

    phase.current += dt * (6.5 + run * 5.5) * (0.25 + move * 0.75);
    const p = phase.current;
    const swing = (0.5 + run * 0.5) * move;

    const idleBreath = Math.sin(t * 1.9) * 0.006 * (1 - move);

    if (body.current) {
      body.current.position.y = Math.abs(Math.sin(p)) * (0.022 + run * 0.035) * move + idleBreath;
      body.current.rotation.z = Math.sin(p) * 0.035 * move;
    }
    if (spine.current) {
      spine.current.rotation.x = 0.04 * move + run * 0.17;
      spine.current.rotation.y = Math.sin(p) * 0.12 * move;
      spine.current.scale.y = 1 + idleBreath * 2.2;
    }
    if (head.current) {
      head.current.rotation.x = -(0.04 * move + run * 0.17) * 0.6 + Math.sin(t * 0.7) * 0.02 * (1 - move);
      head.current.rotation.y = Math.sin(t * 0.5) * 0.12 * (1 - move) - (spine.current?.rotation.y ?? 0) * 0.6;
    }

    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1;
      const ph = p + (i === 0 ? 0 : Math.PI);
      const L = legs.current[i];
      if (L.hip) L.hip.rotation.x = -Math.sin(ph) * 0.62 * swing + (1 - move) * 0.0;
      if (L.knee) L.knee.rotation.x = (Math.max(0, -Math.cos(ph + 0.3)) * (0.75 + run * 0.75) + 0.04) * move;
      const A = arms.current[i];
      if (A.sh) {
        A.sh.rotation.x = Math.sin(ph) * 0.55 * swing;
        A.sh.rotation.z = s * (0.07 + (1 - move) * 0.03 + Math.sin(t * 1.9) * 0.01 * (1 - move));
      }
      if (A.el) A.el.rotation.x = -(0.12 + move * 0.2 + run * 1.0 + Math.max(0, Math.sin(ph)) * 0.25 * move);
    }
  });

  const leg = (i: number, x: number) => (
    <group
      ref={(el) => {
        legs.current[i].hip = el;
      }}
      position={[x, 0.9, 0]}
    >
      <mesh geometry={g.thigh} material={m.pants} position={[0, -0.2, 0]} castShadow />
      <group
        ref={(el) => {
          legs.current[i].knee = el;
        }}
        position={[0, -0.4, 0]}
      >
        <mesh geometry={g.shin} material={m.pants} position={[0, -0.21, 0]} castShadow />
        <group position={[0, -0.42, 0]}>
          <mesh geometry={g.shoe} material={m.shoe} position={[0, -0.035, 0.045]} castShadow />
          <mesh geometry={g.sole} material={m.sole} position={[0, -0.075, 0.045]} />
        </group>
      </group>
    </group>
  );

  const arm = (i: number, x: number) => (
    <group
      ref={(el) => {
        arms.current[i].sh = el;
      }}
      position={[x, 1.42, 0]}
    >
      <mesh geometry={g.shoulder} material={m.jacket} castShadow />
      <mesh geometry={g.upperArm} material={m.jacket} position={[0, -0.15, 0]} castShadow />
      <group
        ref={(el) => {
          arms.current[i].el = el;
        }}
        position={[0, -0.29, 0]}
      >
        <mesh geometry={g.foreArm} material={m.jacket} position={[0, -0.13, 0]} castShadow />
        <mesh geometry={g.hem} material={m.trim} position={[0, -0.235, 0]} scale={[0.34, 0.5, 0.34]} />
        <mesh geometry={g.hand} material={m.skin} position={[0, -0.29, 0]} />
      </group>
    </group>
  );

  return (
    <group ref={body}>
      {/* kaki */}
      {leg(0, -0.095)}
      {leg(1, 0.095)}

      {/* pinggul & celana hitam */}
      <mesh geometry={g.pelvis} material={m.pants} position={[0, 0.93, 0]} castShadow />

      <group ref={spine} position={[0, 0.98, 0]}>
        <group position={[0, -0.98, 0]}>
          {/* jaket almamater merah */}
          <mesh geometry={g.torso} material={m.jacket} position={[0, 1.2, 0]} scale={[1, 1, 0.66]} castShadow />
          <mesh geometry={g.hem} material={m.trim} position={[0, 0.96, 0]} scale={[1, 1, 0.66]} />
          <mesh geometry={g.zip} material={m.zip} position={[0, 1.2, 0.118]} />
          {/* patch dada placeholder (tanpa logo) */}
          <mesh geometry={g.patch} material={m.patch} position={[0.085, 1.33, 0.117]} />
          <mesh geometry={g.collar} material={m.trim} position={[0, 1.455, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.15, 1.0, 1]} />

          {arm(0, -0.22)}
          {arm(1, 0.22)}

          <mesh geometry={g.neck} material={m.skin} position={[0, 1.5, 0]} />
          <group ref={head} position={[0, 1.62, 0]}>
            <mesh geometry={g.head} material={m.skin} scale={[0.95, 1.1, 1]} castShadow />
            <mesh geometry={g.hairCap} material={m.hair} position={[0, 0.012, -0.006]} rotation={[-0.25, 0, 0]} scale={[0.97, 1.1, 1.02]} />
            <mesh geometry={g.eye} material={m.eye} position={[-0.04, 0.012, 0.106]} />
            <mesh geometry={g.eye} material={m.eye} position={[0.04, 0.012, 0.106]} />
          </group>
        </group>
      </group>
    </group>
  );
};
