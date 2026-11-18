import { useSyncExternalStore } from 'react';
import type { IslandId } from '../data/types';

export interface MuseumState {
  /** Zona pulau yang sedang didekati pemain (dalam radius interaksi). */
  nearbyZone: IslandId | null;
  /** Zona yang panelnya sedang dibuka. */
  activeZone: IslandId | null;
  /** Pulau yang sedang dituju globe. */
  globeTarget: IslandId | null;
  selectedProvince: string | null;
  hoverProvince: string | null;
}

type Listener = () => void;

let state: MuseumState = {
  nearbyZone: null,
  activeZone: null,
  globeTarget: null,
  selectedProvince: null,
  hoverProvince: null
};
const listeners = new Set<Listener>();

const set = (patch: Partial<MuseumState>) => {
  let changed = false;
  for (const k of Object.keys(patch) as (keyof MuseumState)[]) {
    if (state[k] !== patch[k]) changed = true;
  }
  if (!changed) return;
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export const museum = {
  getState: () => state,
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  setNearbyZone: (id: IslandId | null) => set({ nearbyZone: id }),
  setGlobeTarget: (id: IslandId | null) => set({ globeTarget: id }),
  openZone: (id: IslandId) => set({ activeZone: id, selectedProvince: null, hoverProvince: null }),
  closeZone: () => set({ activeZone: null, selectedProvince: null, hoverProvince: null }),
  selectProvince: (id: string | null) => set({ selectedProvince: id }),
  hoverProvince: (id: string | null) => set({ hoverProvince: id })
};

/** Hook reaktif dengan selector; komponen hanya render ulang saat nilai yang dipilih berubah. */
export function useMuseum<T>(selector: (s: MuseumState) => T): T {
  return useSyncExternalStore(
    museum.subscribe,
    () => selector(state),
    () => selector(state)
  );
}

/** Intensitas highlight per pulau (0..1), diperbarui oleh globe & dibaca zona untuk sinkronisasi cahaya. */
export const zoneEnergy: Record<IslandId, number> = {
  sumatera: 0,
  jawa: 0,
  kalimantan: 0,
  sulawesi: 0,
  papua: 0
};
