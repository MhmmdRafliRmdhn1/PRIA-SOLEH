import React, { useMemo } from 'react';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import {
  createRedCarpetTexture,
  createDarkWallTexture,
  createMarbleFloorTexture,
  createGoldTrimTexture
} from '../../utils/textures';

export const MuseumScene: React.FC = () => {
  const redCarpetTexture = useMemo(() => createRedCarpetTexture(), []);
  const darkWallTexture = useMemo(() => createDarkWallTexture(), []);
  const marbleFloorTexture = useMemo(() => createMarbleFloorTexture(), []);
  const goldTrimTexture = useMemo(() => createGoldTrimTexture(), []);

  const W = 18;   // room width  X: -9 to +9
  const L = 26;   // room length Z: -13 to +13
  const H = 8;    // room height
  const HW = W / 2;
  const HL = L / 2;

  return (
    <group>
      {/* ───────────────────────────────────────────
          PHYSICS FLOOR SLAB (thick box, top at y=0)
          PlaneGeometry cannot generate a solid Rapier
          collider; use a CuboidCollider instead.
      ─────────────────────────────────────────── */}
      <RigidBody type="fixed" friction={0.9} restitution={0.0}>
        <CuboidCollider args={[HW, 0.5, HL]} position={[0, -0.5, 0]} />
      </RigidBody>

      {/* Visual floor: polished dark marble tiles */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial map={marbleFloorTexture} roughness={0.2} metalness={0.5} />
      </mesh>

      {/* ───────────────────────────────────────────
          RED CARPET — central aisle strip
      ─────────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]} receiveShadow>
        <planeGeometry args={[3.6, L - 2]} />
        <meshStandardMaterial map={redCarpetTexture} roughness={0.9} metalness={0.1} />
      </mesh>

      {/* ───────────────────────────────────────────
          CEILING
      ─────────────────────────────────────────── */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]}>
        <planeGeometry args={[W, L]} />
        <meshStandardMaterial color="#0b0d12" roughness={0.8} />
      </mesh>

      {/* Ceiling coffered arch beams */}
      {[-8, -4, 0, 4, 8].map((z) => (
        <group key={`beam-${z}`} position={[0, H - 0.2, z]}>
          <mesh>
            <boxGeometry args={[W - 0.2, 0.35, 0.5]} />
            <meshStandardMaterial color="#171922" roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.22, 0]}>
            <boxGeometry args={[W - 0.4, 0.07, 0.18]} />
            <meshStandardMaterial map={goldTrimTexture} color="#d4af37" metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ───────────────────────────────────────────
          BOUNDARY WALLS (each is a RigidBody box)
      ─────────────────────────────────────────── */}
      {/* North wall */}
      <RigidBody type="fixed">
        <mesh position={[0, H / 2, -HL]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.5]} />
          <meshStandardMaterial map={darkWallTexture} roughness={0.6} metalness={0.15} />
        </mesh>
      </RigidBody>

      {/* South wall */}
      <RigidBody type="fixed">
        <mesh position={[0, H / 2, HL]} castShadow receiveShadow>
          <boxGeometry args={[W, H, 0.5]} />
          <meshStandardMaterial map={darkWallTexture} roughness={0.6} metalness={0.15} />
        </mesh>
      </RigidBody>

      {/* West wall */}
      <RigidBody type="fixed">
        <mesh position={[-HW, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, H, L]} />
          <meshStandardMaterial map={darkWallTexture} roughness={0.6} metalness={0.15} />
        </mesh>
      </RigidBody>

      {/* East wall */}
      <RigidBody type="fixed">
        <mesh position={[HW, H / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.5, H, L]} />
          <meshStandardMaterial map={darkWallTexture} roughness={0.6} metalness={0.15} />
        </mesh>
      </RigidBody>

      {/* ───────────────────────────────────────────
          GOLD BASEBOARDS & CROWN MOLDINGS
      ─────────────────────────────────────────── */}
      {/* North & South baseboard */}
      {[-HL + 0.28, HL - 0.28].map((z) => (
        <group key={`mol-ns-${z}`}>
          <mesh position={[0, 0.2, z]}>
            <boxGeometry args={[W, 0.4, 0.1]} />
            <meshStandardMaterial map={goldTrimTexture} color="#d4af37" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, H - 0.2, z]}>
            <boxGeometry args={[W, 0.25, 0.1]} />
            <meshStandardMaterial map={goldTrimTexture} color="#d4af37" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* West & East baseboard */}
      {[-HW + 0.28, HW - 0.28].map((x) => (
        <group key={`mol-we-${x}`}>
          <mesh position={[x, 0.2, 0]}>
            <boxGeometry args={[0.1, 0.4, L]} />
            <meshStandardMaterial map={goldTrimTexture} color="#d4af37" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[x, H - 0.2, 0]}>
            <boxGeometry args={[0.1, 0.25, L]} />
            <meshStandardMaterial map={goldTrimTexture} color="#d4af37" metalness={0.8} roughness={0.25} />
          </mesh>
        </group>
      ))}

      {/* ───────────────────────────────────────────
          GRAND PILLARS — 4 pairs (8 total)
          Each pair flanks the main aisle at ±6.5 X
      ─────────────────────────────────────────── */}
      {([-6.5, 6.5] as number[]).map((x) =>
        ([-8, -2.5, 3.5, 9] as number[]).map((z) => (
          <group key={`pillar-${x}-${z}`} position={[x, 0, z]}>
            {/* Solid physics collider for each pillar */}
            <RigidBody type="fixed">
              <CuboidCollider args={[0.42, H / 2, 0.42]} position={[0, H / 2, 0]} />
            </RigidBody>

            {/* Pillar shaft visual */}
            <mesh position={[0, H / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.84, H, 0.84]} />
              <meshStandardMaterial color="#16192280" roughness={0.35} metalness={0.25} />
            </mesh>

            {/* Gold plinth base */}
            <mesh position={[0, 0.38, 0]}>
              <boxGeometry args={[1.1, 0.75, 1.1]} />
              <meshStandardMaterial map={goldTrimTexture} color="#c8a830" metalness={0.9} roughness={0.2} />
            </mesh>

            {/* Gold capital top */}
            <mesh position={[0, H - 0.38, 0]}>
              <boxGeometry args={[1.12, 0.75, 1.12]} />
              <meshStandardMaterial map={goldTrimTexture} color="#c8a830" metalness={0.9} roughness={0.2} />
            </mesh>
          </group>
        ))
      )}

      {/* ───────────────────────────────────────────
          NORTH FOCAL WALL — Grand Museum Plaque
      ─────────────────────────────────────────── */}
      <group position={[0, 4.0, -HL + 0.28]}>
        <mesh>
          <boxGeometry args={[5.5, 2.6, 0.08]} />
          <meshStandardMaterial map={goldTrimTexture} color="#c8a830" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[5.0, 2.1, 0.04]} />
          <meshStandardMaterial color="#0b0d12" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>
    </group>
  );
};
