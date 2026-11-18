import type { CultureItem, IslandId, MotifKind, Province } from '../types';

type Pair = [name: string, note: string];

const items = (pairs: Pair[]): CultureItem[] => pairs.map(([name, note]) => ({ name, note }));

interface ProvinceInput {
  id: string;
  name: string;
  capital: string;
  coord: [number, number];
  foods: Pair[];
  products: Pair[];
  arts: Pair[];
  history: string;
  emoji: string;
  colors: [string, string];
  motif: MotifKind;
}

/** Membuat objek Province dari format ringkas agar file data tetap mudah dibaca. */
export const makeProvince = (islandId: IslandId, p: ProvinceInput): Province => ({
  id: p.id,
  islandId,
  name: p.name,
  capital: p.capital,
  coord: p.coord,
  foods: items(p.foods),
  products: items(p.products),
  arts: items(p.arts),
  history: p.history,
  visual: { emoji: p.emoji, colors: p.colors, motif: p.motif }
});
