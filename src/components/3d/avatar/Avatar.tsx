import React, { Component, Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { soundManager } from '../../../utils/sound';
import { ZONES, ZONE_TRIGGER_RADIUS, SPAWN } from '../../../config/layout';
import { museum } from '../../../state/museumStore';
import { playerState } from '../../../state/playerState';
import { StudentRig } from './StudentRig';
import { GlbStudent, glbExists } from './GlbStudent';
import { AVATAR_GLB_URL, HALF_H, RAD, RUN_SPEED, SPAWN_Y, VIS_OFFSET_Y, WALK_SPEED } from './avatarConfig';

/** Jika GLB gagal dimuat/diparse, jatuh kembali ke avatar prosedural. */
class ModelBoundary extends Component<{ fallback: React.ReactNode; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.warn('[Avatar] GLB gagal dimuat, memakai avatar prosedural.', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const AvatarModel: React.FC = () => {
  const [useGlb, setUseGlb] = useState(false);
  useEffect(() => {
    let alive = true;
    glbExists(AVATAR_GLB_URL).then((ok) => alive && setUseGlb(ok));
    return () => {
      alive = false;
    };
  }, []);
  const fallback = <StudentRig />;
  if (!useGlb) return fallback;
  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GlbStudent />
      </Suspense>
    </ModelBoundary>
  );
};

interface AvatarProps {
  isInspecting: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ isInspecting }) => {
  const body = useRef<RapierRigidBody>(null);
  const visual = useRef<THREE.Group>(null);
  const lastStep = useRef(0);
  const inspecting = useRef(isInspecting);
  inspecting.current = isInspecting;

  useFrame((state, delta) => {
    const rb = body.current;
    const vis = visual.current;
    if (!rb || !vis) return;
    const dt = Math.min(delta, 0.05);
    const ps = playerState;

    const t = rb.translation();
    ps.position.x = t.x;
    ps.position.y = t.y;
    ps.position.z = t.z;

    // zona terdekat dalam radius interaksi
    let nearId: (typeof ZONES)[number]['id'] | null = null;
    let minD = ZONE_TRIGGER_RADIUS;
    for (const z of ZONES) {
      const d = Math.hypot(t.x - z.position[0], t.z - z.position[2]);
      if (d < minD) {
        minD = d;
        nearId = z.id;
      }
    }
    museum.setNearbyZone(nearId);

    const v = rb.linvel();
    if (inspecting.current) {
      rb.setLinvel({ x: 0, y: v.y, z: 0 }, true);
      ps.moving = false;
      ps.running = false;
      ps.speed = 0;
      return;
    }

    const inp = ps.input;
    let ix = inp.keyX + inp.joyX;
    let iy = inp.keyY + inp.joyY;
    const mag = Math.hypot(ix, iy);
    if (mag > 1) {
      ix /= mag;
      iy /= mag;
    }
    const strength = Math.min(1, mag);
    const moving = strength > 0.08;
    // lari: Shift, atau joystick didorong penuh
    const running = moving && (inp.run || (inp.joyX !== 0 || inp.joyY !== 0 ? Math.hypot(inp.joyX, inp.joyY) > 0.9 : false));

    ps.moving = moving;
    ps.running = running;

    if (moving) {
      // Arah "maju" = menjauhi kamera: f = (-sin yaw, -cos yaw), kanan r = (cos yaw, -sin yaw).
      const sy = Math.sin(ps.cameraYaw);
      const cy = Math.cos(ps.cameraYaw);
      const wx = -sy * iy + cy * ix;
      const wz = -cy * iy - sy * ix;
      const wl = Math.hypot(wx, wz) || 1;
      const dx = wx / wl;
      const dz = wz / wl;
      const angle = Math.atan2(dx, dz);
      const speed = (running ? RUN_SPEED : WALK_SPEED) * (running ? 1 : Math.max(0.55, strength));
      rb.setLinvel({ x: dx * speed, y: v.y, z: dz * speed }, true);
      ps.heading.x = dx;
      ps.heading.z = dz;

      const diff = ((angle - vis.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      vis.rotation.y += diff * Math.min(1, dt * 14);

      const interval = running ? 0.23 : 0.36;
      if (state.clock.elapsedTime - lastStep.current > interval) {
        soundManager.playFootstep();
        lastStep.current = state.clock.elapsedTime;
      }
    } else {
      rb.setLinvel({ x: v.x * 0.6, y: v.y, z: v.z * 0.6 }, true);
    }
    ps.velocity.x = v.x;
    ps.velocity.z = v.z;
    ps.speed = Math.hypot(v.x, v.z);
  });

  return (
    <RigidBody
      ref={body}
      position={[SPAWN.x, SPAWN_Y, SPAWN.z]}
      colliders={false}
      enabledRotations={[false, false, false]}
      mass={70}
      linearDamping={4}
      angularDamping={8}
      type="dynamic"
    >
      <CapsuleCollider args={[HALF_H, RAD]} />
      <group ref={visual} position={[0, VIS_OFFSET_Y, 0]} rotation={[0, Math.PI, 0]}>
        <AvatarModel />
      </group>
    </RigidBody>
  );
};
