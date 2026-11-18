import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export interface GeoPart {
  geo: THREE.BufferGeometry;
  matrix?: THREE.Matrix4;
}

/** Menggabungkan banyak geometri statis menjadi satu (1 draw call). Geometri sumber dibuang. */
export function mergeParts(parts: GeoPart[]): THREE.BufferGeometry {
  const list = parts.map(({ geo, matrix }) => {
    const g = matrix ? geo.clone().applyMatrix4(matrix) : geo.clone();
    return g;
  });
  const merged = mergeGeometries(list, false);
  list.forEach((g) => g.dispose());
  parts.forEach(({ geo }) => geo.dispose());
  if (!merged) throw new Error('mergeParts: atribut geometri tidak kompatibel');
  return merged;
}

const tmpM = new THREE.Matrix4();
const tmpQ = new THREE.Quaternion();
const tmpE = new THREE.Euler();
export function matrixOf(
  pos: [number, number, number],
  rotY = 0,
  rotX = 0,
  scale: [number, number, number] = [1, 1, 1]
): THREE.Matrix4 {
  tmpE.set(rotX, rotY, 0, 'YXZ');
  tmpQ.setFromEuler(tmpE);
  return tmpM.clone().compose(new THREE.Vector3(...pos), tmpQ, new THREE.Vector3(...scale));
}
