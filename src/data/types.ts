export type IslandId = 'papua' | 'kalimantan' | 'sumatera' | 'sulawesi' | 'jawa';

/** Satu butir informasi (makanan / produk / kesenian) beserta catatan singkat. */
export interface CultureItem {
  name: string;
  note: string;
}

export type MotifKind = 'songket' | 'wave' | 'batik' | 'zigzag' | 'leaf' | 'dots';

/** Representasi visual provinsi (dirender sebagai kartu bermotif, bukan gambar eksternal). */
export interface ProvinceVisual {
  emoji: string;
  /** Dua warna gradien, tetap dalam palet putih / emas hangat. */
  colors: [string, string];
  motif: MotifKind;
}

export interface Province {
  id: string;
  islandId: IslandId;
  name: string;
  capital: string;
  /** Koordinat ibu kota [bujur, lintang] — dipakai untuk pin di model pulau. */
  coord: [number, number];
  foods: CultureItem[];
  products: CultureItem[];
  arts: CultureItem[];
  history: string;
  visual: ProvinceVisual;
}

export interface IslandFact {
  label: string;
  value: string;
}

export interface Island {
  id: IslandId;
  name: string;
  tagline: string;
  description: string;
  facts: IslandFact[];
  /** Titik fokus globe [bujur, lintang]. */
  focus: [number, number];
}
