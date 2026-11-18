import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { QUALITY } from '../../config/quality';
import { playerState } from '../../state/playerState';

/**
 * Pencahayaan terang & sinematik:
 *  - Environment (Lightformer lokal, tanpa unduhan HDR) untuk pantulan lantai/emas
 *  - hemisphere + satu directional bayangan yang mengikuti avatar (bayangan tajam, murah)
 *  - cahaya hangat di plaza
 */
export const Lighting: React.FC = () => {
  const key = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const l = key.current;
    if (!l) return;
    const p = playerState.position;
    l.position.set(p.x + 9, 22, p.z + 7);
    l.target.position.set(p.x, 0, p.z);
    l.target.updateMatrixWorld();
  });

  return (
    <>
      <color attach="background" args={['#f6f1e7']} />
      <fog attach="fog" args={['#f8f3ea', 55, 110]} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="circle" intensity={5} position={[0, 18, 0]} rotation-x={Math.PI / 2} scale={14} color="#ffffff" />
        <Lightformer form="rect" intensity={2.4} position={[-18, 6, 0]} rotation-y={Math.PI / 2} scale={[16, 6, 1]} color="#fff8e6" />
        <Lightformer form="rect" intensity={2.4} position={[18, 6, 0]} rotation-y={-Math.PI / 2} scale={[16, 6, 1]} color="#fff0cc" />
        <Lightformer form="rect" intensity={1.8} position={[0, 6, -18]} scale={[16, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.8} position={[0, 6, 18]} rotation-y={Math.PI} scale={[16, 6, 1]} color="#ffffff" />
      </Environment>

      <hemisphereLight args={['#ffffff', '#f7ecd2', 1.0]} />

      <directionalLight
        ref={key}
        intensity={1.9}
        color="#fff3da"
        castShadow
        shadow-mapSize-width={QUALITY.shadowMapSize}
        shadow-mapSize-height={QUALITY.shadowMapSize}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />

      {/* cahaya hangat di sekitar plaza */}
      <pointLight position={[0, 3.2, 0]} intensity={90} distance={22} decay={2} color="#ffe2a0" />
      <pointLight position={[0, 14, 0]} intensity={400} distance={34} decay={2} color="#fff6e2" />
    </>
  );
};
