import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { HALL, getZone } from '../../config/layout';
import { playerState, CAMERA_PITCH_MIN, CAMERA_PITCH_MAX } from '../../state/playerState';
import { museum } from '../../state/museumStore';

/**
 * Kamera third-person. Saat panel pulau terbuka, kamera berpindah halus untuk membingkai
 * hologram pulau; setelah ditutup kembali ke belakang avatar.
 */
export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const smoothPos = useRef(new THREE.Vector3(0, 3.2, 17.5));
  const smoothLook = useRef(new THREE.Vector3(0, 3.2, 8));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLook.current);
  }, [camera]);

  useFrame((_, delta) => {
    const alpha = 1 - Math.exp(-delta * 5);
    const active = museum.getState().activeZone;

    if (active) {
      const z = getZone(active);
      const [zx, , zz] = z.position;
      const len = Math.hypot(zx, zz) || 1;
      // titik pandang: dari arah pusat aula menuju zona, agak ke samping agar tidak tertutup panel kanan
      const ix = -zx / len, iz = -zz / len;
      // geser titik bidik ke kanan agar model pulau tampil di sisi kiri, tidak tertutup panel
      targetPos.current.set(zx + ix * 11.5, 5.0, zz + iz * 11.5);
      const dx = zx - targetPos.current.x, dz = zz - targetPos.current.z;
      const dl = Math.hypot(dx, dz) || 1;
      // kanan layar = (-dz, dx) / panjang
      targetLook.current.set(zx + (-dz / dl) * 3.4, 3.7, zz + (dx / dl) * 3.4);
    } else {
      const { x: ax, y: ay, z: az } = playerState.position;
      const pitch = Math.max(CAMERA_PITCH_MIN, Math.min(CAMERA_PITCH_MAX, playerState.cameraPitch));
      const dist = 4.8;
      const cosP = Math.cos(pitch);
      let tx = ax + Math.sin(playerState.cameraYaw) * cosP * dist;
      let tz = az + Math.cos(playerState.cameraYaw) * cosP * dist;
      let ty = ay + Math.sin(pitch) * dist + 1.1;

      // jaga kamera tetap di dalam dinding aula
      const maxR = HALL.radius - 1.6;
      const r = Math.hypot(tx, tz);
      if (r > maxR) {
        tx *= maxR / r;
        tz *= maxR / r;
      }
      ty = Math.max(0.7, Math.min(10, ty));

      targetPos.current.set(tx, ty, tz);
      targetLook.current.set(ax, ay + 0.95 + Math.max(0, -pitch) * 2.5, az);
    }

    smoothPos.current.lerp(targetPos.current, alpha);
    smoothLook.current.lerp(targetLook.current, alpha);
    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLook.current);
  });

  return null;
};
