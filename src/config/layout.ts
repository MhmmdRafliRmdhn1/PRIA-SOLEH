import { ISLAND_ORDER } from '../data/islands';
import type { IslandId } from '../data/types';

/** Dimensi aula utama (satuan meter). */
export const HALL = {
  radius: 33,
  wallHeight: 12,
  domeRise: 10,
  pillarRingRadius: 30.2,
  pillarCount: 30
} as const;

/** Globe melayang tepat di tengah aula. */
export const GLOBE = {
  position: [0, 7.6, 0] as [number, number, number],
  radius: 3.9
};

export const PLAZA_PEDESTAL_RADIUS = 1.9;

/** Radius cincin zona dari pusat aula, dan jarak pemicu interaksi. */
export const ZONE_RING_RADIUS = 21;
export const ZONE_TRIGGER_RADIUS = 7;

export const SPAWN = { x: 0, z: 13 };

/**
 * Bearing zona (derajat, searah jarum jam dari utara).
 * Urutan barat → timur mengikuti kompas: Sumatera, Jawa, Kalimantan, Sulawesi, Papua.
 */
const BEARINGS: Record<IslandId, number> = {
  sumatera: 260,
  jawa: 310,
  kalimantan: 0,
  sulawesi: 50,
  papua: 100
};

export interface ZoneLayout {
  id: IslandId;
  bearingDeg: number;
  /** Posisi pusat zona di dunia [x, y, z]. */
  position: [number, number, number];
  /** Rotasi Y agar sisi depan (+z lokal) menghadap pusat aula. */
  rotationY: number;
}

export const ZONES: ZoneLayout[] = ISLAND_ORDER.map((id) => {
  const b = (BEARINGS[id] * Math.PI) / 180;
  return {
    id,
    bearingDeg: BEARINGS[id],
    position: [Math.sin(b) * ZONE_RING_RADIUS, 0, -Math.cos(b) * ZONE_RING_RADIUS],
    rotationY: -b
  };
});

export const getZone = (id: IslandId): ZoneLayout => ZONES.find((z) => z.id === id)!;

/** Palet tema putih & emas. */
export const COLORS = {
  ivory: '#fdfaf3',
  marble: '#f7f4ec',
  gold: '#d9a82a',
  goldBright: '#ffc933',
  goldDeep: '#b8860b',
  led: '#ffc24d',
  warmWhite: '#fff4dc'
} as const;
