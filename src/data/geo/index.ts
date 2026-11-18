import raw from './indonesiaGeo.json';
import type { IslandId } from '../types';

/** Cincin poligon datar: [lon*100, lat*100, lon*100, lat*100, ...] (dikuantisasi untuk ukuran kecil). */
export type Ring = number[];

interface GeoFile {
  islands: Record<IslandId, Ring[]>;
  other: Ring[];
  foreign: Ring[];
  world: Ring[];
  centroids: Record<IslandId, [number, number, number, number, number, number]>;
}

export const GEO = raw as unknown as GeoFile;

export interface IslandGeoInfo {
  /** Pusat massa [lon, lat]. */
  centroid: [number, number];
  /** Kotak batas [minLon, minLat, maxLon, maxLat]. */
  bounds: [number, number, number, number];
}

export const getIslandGeo = (id: IslandId): IslandGeoInfo => {
  const c = GEO.centroids[id];
  return { centroid: [c[0], c[1]], bounds: [c[2], c[3], c[4], c[5]] };
};

/** Region resolusi tinggi pada tekstur globe (derajat). */
export const REGION = { lon0: 90, lon1: 150, lat0: -14, lat1: 12 } as const;

/** Kode id pulau yang ditulis ke tekstur mask. Indeks 1..5. */
export const ISLAND_MASK_ORDER: IslandId[] = ['sumatera', 'jawa', 'kalimantan', 'sulawesi', 'papua'];
