import * as THREE from 'three';
import { GEO, getIslandGeo } from '../data/geo';
import type { IslandId } from '../data/types';

/** Lebar model hologram per pulau (meter). */
const HOLO_SIZE: Record<IslandId, number> = {
  sumatera: 5.2,
  jawa: 6.2,
  kalimantan: 4.8,
  sulawesi: 4.8,
  papua: 5.6
};

export interface IslandModel {
  geometry: THREE.ExtrudeGeometry;
  edges: THREE.EdgesGeometry;
  depth: number;
  /** Proyeksi bujur/lintang → koordinat bidang peta (x, y) dalam meter, sebelum rotasi ke bidang datar. */
  project: (lon: number, lat: number) => [number, number];
}

/** Membangun model 3D pulau dari poligon garis pantai asli. */
export function buildIslandModel(id: IslandId): IslandModel {
  const info = getIslandGeo(id);
  const [minLon, minLat, maxLon, maxLat] = info.bounds;
  const cx = (minLon + maxLon) / 2;
  const cy = (minLat + maxLat) / 2;
  const k = HOLO_SIZE[id] / Math.max(maxLon - minLon, maxLat - minLat);

  const shapes: THREE.Shape[] = [];
  for (const ring of GEO.islands[id]) {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i < ring.length; i += 2) {
      pts.push(new THREE.Vector2((ring[i] / 100 - cx) * k, (ring[i + 1] / 100 - cy) * k));
    }
    if (pts.length > 3) shapes.push(new THREE.Shape(pts));
  }

  const depth = 0.16;
  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 1,
    curveSegments: 1
  });
  const edges = new THREE.EdgesGeometry(geometry, 35);
  return {
    geometry,
    edges,
    depth,
    project: (lon, lat) => [(lon - cx) * k, (lat - cy) * k]
  };
}
