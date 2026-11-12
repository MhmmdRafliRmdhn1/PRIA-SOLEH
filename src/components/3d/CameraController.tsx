import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CulturalExhibit } from '../../utils/culturalData';

interface CameraControllerProps {
  avatarPos: [number, number, number];
  cameraOrbit: { yaw: number; pitch: number };
  activeExhibit: CulturalExhibit | null;
  isInspecting: boolean;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  avatarPos,
  cameraOrbit,
  activeExhibit,
  isInspecting
}) => {
  const { camera } = useThree();

  const smoothPos    = useRef(new THREE.Vector3(0, 3.5, 11));
  const smoothLookAt = useRef(new THREE.Vector3(0, 1.0, 7));
  const targetPos    = useRef(new THREE.Vector3());
  const targetLook   = useRef(new THREE.Vector3());

  // Set camera to a good initial position immediately on mount
  useEffect(() => {
    camera.position.set(0, 3.5, 11);
    camera.lookAt(0, 1.0, 7);
  }, [camera]);

  useFrame((_, delta) => {
    const alpha = Math.min(1, delta * 6);

    if (isInspecting && activeExhibit) {
      const [ex, ey, ez] = activeExhibit.modelPosition;
      const rot = activeExhibit.rotationY;
      const dist = 2.6;

      targetPos.current.set(
        ex + Math.sin(rot) * dist,
        ey + 1.65,
        ez + Math.cos(rot) * dist
      );
      targetLook.current.set(ex, ey + 1.5, ez);
    } else {
      const [ax, ay, az] = avatarPos;

      // Clamp pitch so camera never dips below 5° above horizontal
      const pitch = Math.max(0.05, Math.min(1.1, cameraOrbit.pitch));

      const dist  = 4.5;
      const sinP  = Math.sin(pitch);
      const cosP  = Math.cos(pitch);
      const sinY  = Math.sin(cameraOrbit.yaw);
      const cosY  = Math.cos(cameraOrbit.yaw);

      let tx = ax + sinY * cosP * dist;
      let tz = az + cosY * cosP * dist;
      let ty = ay + sinP * dist + 1.4;  // always well above avatar head

      // Clamp within museum bounds so camera doesn't clip walls
      tx = Math.max(-8.0, Math.min(8.0, tx));
      tz = Math.max(-11.5, Math.min(11.5, tz));
      ty = Math.max(1.2, Math.min(7.0, ty));  // never below 1.2 m off floor

      targetPos.current.set(tx, ty, tz);
      // Look at avatar's upper chest / head level
      targetLook.current.set(ax, ay + 1.1, az);
    }

    smoothPos.current.lerp(targetPos.current, alpha);
    smoothLookAt.current.lerp(targetLook.current, alpha);

    camera.position.copy(smoothPos.current);
    camera.lookAt(smoothLookAt.current);
  });

  return null;
};
