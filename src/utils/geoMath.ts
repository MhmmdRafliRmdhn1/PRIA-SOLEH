import * as THREE from 'three';

const DEG = Math.PI / 180;

/**
 * Arah satuan di objek bola untuk bujur/lintang tertentu.
 * Konvensi mengikuti UV SphereGeometry: bujur 0° → +X, bujur 90°E → −Z, kutub utara → +Y.
 */
export function lonLatToDirection(lonDeg: number, latDeg: number, out = new THREE.Vector3()): THREE.Vector3 {
  const lon = lonDeg * DEG;
  const lat = latDeg * DEG;
  return out.set(Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon));
}

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
