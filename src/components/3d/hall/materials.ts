import { useMemo } from 'react';
import * as THREE from 'three';
import { COLORS } from '../../../config/layout';

/** Material bersama untuk seluruh arsitektur agar tidak ada duplikasi instance. */
export function useHallMaterials() {
  return useMemo(
    () => ({
      whiteSatin: new THREE.MeshStandardMaterial({
        color: COLORS.ivory,
        roughness: 0.5,
        metalness: 0.0,
        envMapIntensity: 0.9
      }),
      whiteGloss: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.18,
        metalness: 0.05,
        envMapIntensity: 1.1
      }),
      gold: new THREE.MeshStandardMaterial({
        color: COLORS.gold,
        roughness: 0.26,
        metalness: 1.0,
        envMapIntensity: 1.4
      }),
      led: new THREE.MeshBasicMaterial({ color: COLORS.led, toneMapped: false })
    }),
    []
  );
}
