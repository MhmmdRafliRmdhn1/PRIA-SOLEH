import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { soundManager } from '../../utils/sound';
import { CULTURAL_EXHIBITS } from '../../utils/culturalData';
import { createBatikParangTexture } from '../../utils/textures';

interface AvatarProps {
  onNearExhibit: (exhibitId: string | null) => void;
  movementInput: { x: number; y: number };
  cameraAngleY: number;
  onPositionUpdate: (pos: [number, number, number]) => void;
  isInspecting: boolean;
}

// Avatar dimensions — tuned so feet visually rest on y=0
// RigidBody spawns at y=SPAWN_Y.
// CapsuleCollider: halfHeight=HALF_H, radius=RAD → bottom = SPAWN_Y - HALF_H - RAD
// We want bottom ≈ 0, so SPAWN_Y = HALF_H + RAD + small_gap
const HALF_H = 0.52;    // capsule half-height
const RAD    = 0.28;    // capsule radius
const SPAWN_Y = HALF_H + RAD + 0.08; // ≈ 0.88, bottom of capsule ≈ 0.08 (barely above floor)

// Visual group offset from RigidBody centre so the visual model
// aligns with the capsule: group_y_world = SPAWN_Y + VIS_OFFSET_Y
const VIS_OFFSET_Y = -(SPAWN_Y - 0.05); // ≈ -0.83 → group world y ≈ 0.05

export const Avatar: React.FC<AvatarProps> = ({
  onNearExhibit,
  movementInput,
  cameraAngleY,
  onPositionUpdate,
  isInspecting
}) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const visualGroupRef = useRef<THREE.Group>(null);

  const leftLegRef   = useRef<THREE.Group>(null);
  const rightLegRef  = useRef<THREE.Group>(null);
  const leftArmRef   = useRef<THREE.Group>(null);
  const rightArmRef  = useRef<THREE.Group>(null);
  const headRef      = useRef<THREE.Group>(null);

  const batikTex = useMemo(() => createBatikParangTexture(), []);

  const walkCycle        = useRef(0);
  const lastFootstepTime = useRef(0);
  const targetYaw        = useRef(0);

  const MOVE_SPEED = 5;

  useFrame((state, delta) => {
    if (!rigidBodyRef.current || !visualGroupRef.current) return;

    const t = rigidBodyRef.current.translation();
    onPositionUpdate([t.x, t.y, t.z]);

    // Proximity check
    let nearId: string | null = null;
    let minDist = 2.6;
    for (const ex of CULTURAL_EXHIBITS) {
      const dx = t.x - ex.modelPosition[0];
      const dz = t.z - ex.modelPosition[2];
      const d  = Math.sqrt(dx * dx + dz * dz);
      if (d < minDist) { minDist = d; nearId = ex.id; }
    }
    onNearExhibit(nearId);

    // Freeze movement while reading panel
    if (isInspecting) {
      const v = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({ x: 0, y: v.y, z: 0 }, true);
      [leftLegRef, rightLegRef, leftArmRef, rightArmRef].forEach(r => {
        if (r.current) r.current.rotation.x *= 0.8;
      });
      return;
    }

    const ix = movementInput.x;
    const iy = movementInput.y;
    const moving = Math.abs(ix) > 0.05 || Math.abs(iy) > 0.05;

    if (moving) {
      const angle = Math.atan2(ix, iy) + cameraAngleY;
      rigidBodyRef.current.setLinvel(
        { x: Math.sin(angle) * MOVE_SPEED, y: rigidBodyRef.current.linvel().y, z: Math.cos(angle) * MOVE_SPEED },
        true
      );

      // Smooth rotation toward direction of movement
      targetYaw.current = angle;
      let diff = ((targetYaw.current - visualGroupRef.current.rotation.y) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      visualGroupRef.current.rotation.y += diff * Math.min(1, delta * 14);

      // Limb swing
      walkCycle.current += delta * 10;
      const sw = Math.sin(walkCycle.current) * 0.6;
      if (leftLegRef.current)  leftLegRef.current.rotation.x  =  sw;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -sw;
      if (leftArmRef.current)  leftArmRef.current.rotation.x  = -sw * 0.7;
      if (rightArmRef.current) rightArmRef.current.rotation.x  =  sw * 0.7;

      // Head bob
      if (headRef.current)
        headRef.current.position.y = 1.56 + Math.abs(Math.sin(walkCycle.current)) * 0.04;

      // Footstep audio
      if (state.clock.elapsedTime - lastFootstepTime.current > 0.33) {
        soundManager.playFootstep();
        lastFootstepTime.current = state.clock.elapsedTime;
      }
    } else {
      const v = rigidBodyRef.current.linvel();
      rigidBodyRef.current.setLinvel({ x: v.x * 0.6, y: v.y, z: v.z * 0.6 }, true);

      [leftLegRef, rightLegRef, leftArmRef, rightArmRef].forEach(r => {
        if (r.current) r.current.rotation.x *= 0.75;
      });

      // Idle breathing
      if (headRef.current)
        headRef.current.position.y = 1.56 + Math.sin(state.clock.elapsedTime * 2.2) * 0.012;
    }
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      position={[0, SPAWN_Y, 7]}
      colliders={false}
      enabledRotations={[false, false, false]}
      mass={70}
      linearDamping={4}
      angularDamping={8}
      type="dynamic"
    >
      <CapsuleCollider args={[HALF_H, RAD]} />

      {/* ── Visual avatar group ──
          Offset so visual feet align with the physics capsule bottom.
          capsule_bottom_world = SPAWN_Y - HALF_H - RAD ≈ 0.08
          group_world_y        = SPAWN_Y + VIS_OFFSET_Y ≈ 0.05  */}
      <group ref={visualGroupRef} position={[0, VIS_OFFSET_Y, 0]}>

        {/* HEAD (y relative to group) */}
        <group ref={headRef} position={[0, 1.56, 0]}>
          {/* Skull cube */}
          <mesh castShadow>
            <boxGeometry args={[0.36, 0.34, 0.34]} />
            <meshStandardMaterial color="#f0be9b" roughness={0.55} />
          </mesh>
          {/* Hair block */}
          <mesh position={[0, 0.14, -0.02]} castShadow>
            <boxGeometry args={[0.38, 0.14, 0.36]} />
            <meshStandardMaterial color="#221e20" roughness={0.75} />
          </mesh>
          {/* Front bangs */}
          <mesh position={[0, 0.14, 0.17]}>
            <boxGeometry args={[0.34, 0.08, 0.04]} />
            <meshStandardMaterial color="#221e20" />
          </mesh>
          {/* Eyes */}
          {([-0.08, 0.08] as number[]).map(ex => (
            <mesh key={`eye-${ex}`} position={[ex, 0.02, 0.172]}>
              <boxGeometry args={[0.055, 0.055, 0.01]} />
              <meshBasicMaterial color="#1a1c22" />
            </mesh>
          ))}
          {/* Blangkon batik headband */}
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.38, 0.055, 0.36]} />
            <meshStandardMaterial map={batikTex} roughness={0.5} />
          </mesh>
        </group>

        {/* TORSO */}
        <group position={[0, 1.02, 0]}>
          {/* Dark beskap jacket */}
          <mesh castShadow>
            <boxGeometry args={[0.44, 0.52, 0.28]} />
            <meshStandardMaterial color="#191c24" roughness={0.5} />
          </mesh>
          {/* Batik selendang sash */}
          <mesh position={[0.02, -0.02, 0.01]} rotation={[0, 0, -Math.PI / 4]}>
            <boxGeometry args={[0.11, 0.6, 0.29]} />
            <meshStandardMaterial map={batikTex} roughness={0.5} />
          </mesh>
          {/* Gold buttons */}
          {([-0.12, 0, 0.12] as number[]).map((by) => (
            <mesh key={`btn-${by}`} position={[0, by, 0.142]}>
              <boxGeometry args={[0.03, 0.03, 0.01]} />
              <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.15} />
            </mesh>
          ))}
          {/* Gold belt buckle */}
          <mesh position={[0, -0.24, 0.142]}>
            <boxGeometry args={[0.1, 0.06, 0.02]} />
            <meshStandardMaterial color="#ffd700" metalness={0.95} roughness={0.15} />
          </mesh>
        </group>

        {/* LEFT ARM (pivot at shoulder) */}
        <group ref={leftArmRef} position={[-0.3, 1.18, 0]}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <boxGeometry args={[0.14, 0.44, 0.17]} />
            <meshStandardMaterial color="#191c24" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.13, 0.11, 0.14]} />
            <meshStandardMaterial color="#f0be9b" roughness={0.55} />
          </mesh>
        </group>

        {/* RIGHT ARM */}
        <group ref={rightArmRef} position={[0.3, 1.18, 0]}>
          <mesh castShadow position={[0, -0.22, 0]}>
            <boxGeometry args={[0.14, 0.44, 0.17]} />
            <meshStandardMaterial color="#191c24" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[0.13, 0.11, 0.14]} />
            <meshStandardMaterial color="#f0be9b" roughness={0.55} />
          </mesh>
        </group>

        {/* LEFT LEG (pivot at hip) */}
        <group ref={leftLegRef} position={[-0.13, 0.75, 0]}>
          <mesh castShadow position={[0, -0.3, 0]}>
            <boxGeometry args={[0.17, 0.6, 0.19]} />
            <meshStandardMaterial color="#12141a" roughness={0.65} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.63, 0.04]}>
            <boxGeometry args={[0.17, 0.09, 0.26]} />
            <meshStandardMaterial color="#0a0a0d" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>

        {/* RIGHT LEG */}
        <group ref={rightLegRef} position={[0.13, 0.75, 0]}>
          <mesh castShadow position={[0, -0.3, 0]}>
            <boxGeometry args={[0.17, 0.6, 0.19]} />
            <meshStandardMaterial color="#12141a" roughness={0.65} />
          </mesh>
          <mesh position={[0, -0.63, 0.04]}>
            <boxGeometry args={[0.17, 0.09, 0.26]} />
            <meshStandardMaterial color="#0a0a0d" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      </group>
    </RigidBody>
  );
};
