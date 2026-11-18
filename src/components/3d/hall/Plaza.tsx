import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { GLOBE, PLAZA_PEDESTAL_RADIUS } from '../../../config/layout';
import { useHallMaterials } from './materials';

/** Plaza bertingkat di bawah globe + proyektor hologram. Visual lantai tanpa collider (agar avatar tidak tersangkut). */
export const Plaza: React.FC = () => {
  const mats = useHallMaterials();
  const beamH = GLOBE.position[1] - GLOBE.radius - 1.3;

  const beamMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffd873',
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false
      }),
    []
  );

  return (
    <group>
      {/* Tingkat plaza */}
      <mesh position={[0, 0.07, 0]} material={mats.whiteGloss} receiveShadow>
        <cylinderGeometry args={[7.2, 7.4, 0.14, 96]} />
      </mesh>
      <mesh position={[0, 0.16, 0]} rotation-x={Math.PI / 2} material={mats.gold}>
        <torusGeometry args={[7.2, 0.06, 8, 160]} />
      </mesh>
      <mesh position={[0, 0.21, 0]} material={mats.whiteGloss} receiveShadow>
        <cylinderGeometry args={[4.4, 4.5, 0.14, 80]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} rotation-x={Math.PI / 2} material={mats.led}>
        <torusGeometry args={[4.4, 0.035, 6, 140]} />
      </mesh>

      {/* Pedestal proyektor (padat) */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.7, PLAZA_PEDESTAL_RADIUS]} position={[0, 0.7, 0]} />
      </RigidBody>
      <mesh position={[0, 0.7, 0]} material={mats.whiteGloss} castShadow receiveShadow>
        <cylinderGeometry args={[PLAZA_PEDESTAL_RADIUS * 0.82, PLAZA_PEDESTAL_RADIUS, 1.4, 48]} />
      </mesh>
      <mesh position={[0, 1.4, 0]} rotation-x={Math.PI / 2} material={mats.gold}>
        <torusGeometry args={[PLAZA_PEDESTAL_RADIUS * 0.82, 0.07, 10, 80]} />
      </mesh>
      <mesh position={[0, 1.44, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[PLAZA_PEDESTAL_RADIUS * 0.7, 48]} />
        <meshBasicMaterial color="#ffe7a3" toneMapped={false} />
      </mesh>

      {/* Berkas proyektor menuju globe */}
      <mesh position={[0, 1.45 + beamH / 2, 0]} material={beamMat}>
        <cylinderGeometry args={[0.45, 1.2, beamH, 40, 1, true]} />
      </mesh>
    </group>
  );
};
