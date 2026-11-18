import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CuboidCollider, CylinderCollider } from '@react-three/rapier';
import { HALL } from '../../../config/layout';
import { createWallPanelTexture } from '../../../utils/textures';
import { mergeParts, matrixOf } from '../../../utils/mergeGeo';
import { smoothstep } from '../../../utils/geoMath';
import { useHallMaterials } from './materials';

const WAVES = HALL.pillarCount; // jumlah gelombang dinding = jumlah pilar

/** Dinding silinder dengan gelombang vertikal melengkung (menonjol ke dalam makin ke atas). */
function createWallGeometry(): THREE.BufferGeometry {
  const R = HALL.radius;
  const H = HALL.wallHeight;
  const g = new THREE.CylinderGeometry(R, R, H, 360, 36, true);
  const pos = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const ang = Math.atan2(z, x);
    const yN = (y + H / 2) / H;
    const wave = 0.5 + 0.5 * Math.cos(ang * WAVES + Math.PI); // 0 tepat di belakang pilar
    const amp = 0.25 + 1.05 * smoothstep(0.15, 1, yN);
    const r = R - amp * wave;
    pos.setXYZ(i, r * Math.cos(ang), y + H / 2, r * Math.sin(ang));
  }
  g.computeVertexNormals();
  return g;
}

export const Architecture: React.FC = () => {
  const mats = useHallMaterials();
  const wallTex = useMemo(() => createWallPanelTexture(), []);
  const wallGeo = useMemo(() => createWallGeometry(), []);

  const { shafts, goldBits, archWhite, archGold } = useMemo(() => {
    const N = HALL.pillarCount;
    const Rp = HALL.pillarRingRadius;
    const shaftParts = [];
    const goldParts = [];
    const archWhiteParts = [];
    const archGoldParts = [];

    for (let k = 0; k < N; k++) {
      const a = (k / N) * Math.PI * 2;
      const x = Math.cos(a) * Rp;
      const z = Math.sin(a) * Rp;
      shaftParts.push({
        geo: new THREE.CylinderGeometry(0.4, 0.5, 8.2, 24),
        matrix: matrixOf([x, 4.1, z])
      });
      goldParts.push({
        geo: new THREE.CylinderGeometry(0.58, 0.62, 0.4, 24),
        matrix: matrixOf([x, 0.2, z])
      });
      goldParts.push({
        geo: new THREE.CylinderGeometry(0.56, 0.46, 0.5, 24),
        matrix: matrixOf([x, 8.15, z])
      });
      goldParts.push({
        geo: new THREE.TorusGeometry(0.43, 0.04, 8, 24).rotateX(Math.PI / 2),
        matrix: matrixOf([x, 5.0, z])
      });

      // lengkung penghubung antar pilar
      const am = ((k + 0.5) / N) * Math.PI * 2;
      const mid = Rp * Math.cos(Math.PI / N);
      const chord = 2 * Rp * Math.sin(Math.PI / N);
      const archR = chord / 2 - 0.42;
      const psi = -(am + Math.PI / 2);
      archWhiteParts.push({
        geo: new THREE.TorusGeometry(archR, 0.2, 10, 40, Math.PI),
        matrix: matrixOf([Math.cos(am) * mid, 8.4, Math.sin(am) * mid], psi)
      });
      archGoldParts.push({
        geo: new THREE.TorusGeometry(archR - 0.2, 0.05, 8, 40, Math.PI),
        matrix: matrixOf([Math.cos(am) * mid, 8.4, Math.sin(am) * mid], psi)
      });
    }
    return {
      shafts: mergeParts(shaftParts),
      goldBits: mergeParts(goldParts),
      archWhite: mergeParts(archWhiteParts),
      archGold: mergeParts(archGoldParts)
    };
  }, []);

  // LED pada dasar dinding dan cove atas (digabung)
  const leds = useMemo(() => {
    const ring = (r: number, y: number, tube: number) =>
      new THREE.TorusGeometry(r, tube, 8, 220).rotateX(Math.PI / 2).translate(0, y, 0);
    return mergeParts([
      { geo: ring(HALL.radius - 0.55, 0.2, 0.06) },
      { geo: ring(HALL.radius - 1.45, HALL.wallHeight - 0.9, 0.09) },
      { geo: ring(HALL.radius - 1.2, 10.2, 0.04) }
    ]);
  }, []);

  // Collider dinding & pilar dalam satu rigid body
  const colliders = useMemo(() => {
    const segs = 56;
    const Rw = HALL.radius + 0.7;
    const half = Rw * Math.tan(Math.PI / segs) + 0.08;
    const walls = Array.from({ length: segs }, (_, i) => {
      const a = (i / segs) * Math.PI * 2;
      return {
        key: `w${i}`,
        pos: [Math.cos(a) * Rw, 6, Math.sin(a) * Rw] as [number, number, number],
        rotY: -(a + Math.PI / 2),
        half
      };
    });
    const pillars = Array.from({ length: HALL.pillarCount }, (_, k) => {
      const a = (k / HALL.pillarCount) * Math.PI * 2;
      return {
        key: `p${k}`,
        pos: [Math.cos(a) * HALL.pillarRingRadius, 4.5, Math.sin(a) * HALL.pillarRingRadius] as [number, number, number]
      };
    });
    return { walls, pillars };
  }, []);

  return (
    <group>
      <mesh geometry={wallGeo} receiveShadow>
        <meshStandardMaterial
          map={wallTex}
          color="#ffffff"
          roughness={0.48}
          metalness={0.02}
          emissive="#fff8ea"
          emissiveIntensity={0.22}
          side={THREE.BackSide}
          envMapIntensity={0.9}
        />
      </mesh>

      <mesh geometry={shafts} material={mats.whiteSatin} castShadow receiveShadow />
      <mesh geometry={goldBits} material={mats.gold} />
      <mesh geometry={archWhite} material={mats.whiteSatin} castShadow />
      <mesh geometry={archGold} material={mats.gold} />
      <mesh geometry={leds} material={mats.led} />

      <RigidBody type="fixed" colliders={false} friction={0.2}>
        {colliders.walls.map((w) => (
          <CuboidCollider key={w.key} args={[w.half, 6, 0.7]} position={w.pos} rotation={[0, w.rotY, 0]} />
        ))}
        {colliders.pillars.map((p) => (
          <CylinderCollider key={p.key} args={[4.5, 0.55]} position={p.pos} />
        ))}
      </RigidBody>
    </group>
  );
};
