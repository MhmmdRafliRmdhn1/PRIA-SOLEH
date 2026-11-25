import React, { useMemo } from 'react';
import * as THREE from 'three';
import { RigidBody, CylinderCollider } from '@react-three/rapier';
import { HALL } from '../../../config/layout';
import { QUALITY } from '../../../config/quality';
import { createWhiteMarbleTexture } from '../../../utils/textures';
import { mergeParts } from '../../../utils/mergeGeo';
import { useHallMaterials } from './materials';

/** Cincin datar pada bidang lantai (inlay emas). */
function flatRing(inner: number, outer: number, y: number, segments = 160) {
  const g = new THREE.RingGeometry(inner, outer, segments);
  g.rotateX(-Math.PI / 2);
  g.translate(0, y, 0);
  return g;
}

export const Floor: React.FC = () => {
  const marble = useMemo(() => createWhiteMarbleTexture(), []);
  const mats = useHallMaterials();

  // Semua inlay emas digabung menjadi satu mesh.
  const inlay = useMemo(() => {
    const parts = [
      { geo: flatRing(7.0, 7.14, 0.006) },
      { geo: flatRing(13.0, 13.08, 0.006) },
      { geo: flatRing(20.92, 21.0, 0.006) },
      { geo: flatRing(28.4, 28.55, 0.006) },
      { geo: flatRing(HALL.radius - 0.9, HALL.radius - 0.7, 0.006) }
    ];
    return mergeParts(parts);
  }, []);

  /* ── Material lantai: glossy standard — tidak pakai MeshReflectorMaterial ──
   * MeshReflectorMaterial menggunakan render-target internal yang dapat menghasilkan
   * piksel NaN / hitam saat kamera bergerak cepat akibat depth-buffer race condition.
   * Efek kilauan tetap didapat dari envMapIntensity tinggi + roughness rendah. */
  const floorMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: marble,
        color: '#ffffff',
        roughness: QUALITY.isLowEnd ? 0.35 : 0.14,
        metalness: 0.08,
        envMapIntensity: QUALITY.isLowEnd ? 0.8 : 1.6
      }),
    [marble]
  );

  return (
    <group>
      {/* Lantai fisik: silinder tebal agar collider padat */}
      <RigidBody type="fixed" colliders={false} friction={0.9} restitution={0}>
        <CylinderCollider args={[0.5, HALL.radius + 2]} position={[0, -0.5, 0]} />
      </RigidBody>

      {/* Lantai marmer putih glossy */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[HALL.radius, 128]} />
        <primitive object={floorMat} />
      </mesh>

      <mesh geometry={inlay} material={mats.gold} />
    </group>
  );
};
