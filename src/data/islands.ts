import type { Island, IslandId, Province } from './types';
import { PAPUA_PROVINCES } from './provinces/papua';
import { KALIMANTAN_PROVINCES } from './provinces/kalimantan';
import { SUMATERA_PROVINCES } from './provinces/sumatera';
import { SULAWESI_PROVINCES } from './provinces/sulawesi';
import { JAWA_PROVINCES } from './provinces/jawa';

/** Urutan pulau = urutan tampil di UI (barat → timur ± kompas aula). */
export const ISLAND_ORDER: IslandId[] = ['sumatera', 'jawa', 'kalimantan', 'sulawesi', 'papua'];

export const ISLANDS: Record<IslandId, Island> = {
  papua: {
    id: 'papua',
    name: 'Papua',
    tagline: 'Tanah di ufuk timur Nusantara',
    description:
      'Bagian Indonesia dari pulau Papua (Nugini) yang membentang dari pegunungan bersalju hingga rawa dan terumbu karang. Enam provinsi di wilayah ini menjaga ratusan bahasa dan tradisi adat yang hidup.',
    facts: [
      { label: 'Provinsi', value: '6' },
      { label: 'Puncak Tertinggi', value: 'Puncak Jaya, ± 4.884 m' },
      { label: 'Ikon Budaya', value: 'Noken, Asmat, Raja Ampat' }
    ],
    focus: [137.33, -4.02]
  },
  kalimantan: {
    id: 'kalimantan',
    name: 'Kalimantan',
    tagline: 'Paru-paru hijau di garis khatulistiwa',
    description:
      'Bagian Indonesia dari pulau Borneo yang dialiri sungai-sungai besar dan hutan hujan tropis. Lima provinsinya merawat budaya Dayak, Melayu, Banjar, dan Kutai.',
    facts: [
      { label: 'Provinsi', value: '5' },
      { label: 'Peringkat Dunia', value: 'Pulau terbesar ke-3 (Borneo)' },
      { label: 'Ikon Budaya', value: 'Rumah Betang, Sasirangan' }
    ],
    focus: [114.02, -0.2]
  },
  sumatera: {
    id: 'sumatera',
    name: 'Sumatera',
    tagline: 'Gerbang barat jalur rempah dunia',
    description:
      'Pulau yang menghadap Selat Malaka, pusat kerajaan maritim seperti Sriwijaya dan Aceh. Sepuluh provinsinya menyimpan kuliner rempah yang kuat dan tenun songket berbenang emas.',
    facts: [
      { label: 'Provinsi', value: '10' },
      { label: 'Peringkat Dunia', value: 'Pulau terbesar ke-6' },
      { label: 'Ikon Budaya', value: 'Songket, Rendang, Danau Toba' }
    ],
    focus: [101.66, -0.46]
  },
  sulawesi: {
    id: 'sulawesi',
    name: 'Sulawesi',
    tagline: 'Pulau berbentuk K para pelaut ulung',
    description:
      'Pulau dengan empat semenanjung yang menjadi rumah bagi pelaut Bugis-Makassar dan Mandar, serta budaya Toraja, Minahasa, dan Gorontalo. Enam provinsi mewakili keragaman ini.',
    facts: [
      { label: 'Provinsi', value: '6' },
      { label: 'Kawasan', value: 'Wallacea, zona transisi flora-fauna' },
      { label: 'Ikon Budaya', value: 'Pinisi, Tongkonan, La Galigo' }
    ],
    focus: [121.32, -2.09]
  },
  jawa: {
    id: 'jawa',
    name: 'Jawa',
    tagline: 'Pusat pertemuan keraton, pesisir, dan metropolitan',
    description:
      'Pulau dengan penduduk terbanyak di dunia. Enam provinsinya merentang dari Banten hingga Jawa Timur, dari warisan Majapahit dan Mataram hingga ibu kota Jakarta.',
    facts: [
      { label: 'Provinsi', value: '6' },
      { label: 'Peringkat Dunia', value: 'Pulau berpenduduk terbanyak' },
      { label: 'Ikon Budaya', value: 'Batik, Wayang, Gamelan, Borobudur' }
    ],
    focus: [110.04, -7.28]
  }
};

export const PROVINCES_BY_ISLAND: Record<IslandId, Province[]> = {
  papua: PAPUA_PROVINCES,
  kalimantan: KALIMANTAN_PROVINCES,
  sumatera: SUMATERA_PROVINCES,
  sulawesi: SULAWESI_PROVINCES,
  jawa: JAWA_PROVINCES
};

export const ALL_PROVINCES: Province[] = ISLAND_ORDER.flatMap((id) => PROVINCES_BY_ISLAND[id]);

export const getProvince = (id: string | null | undefined): Province | undefined =>
  id ? ALL_PROVINCES.find((p) => p.id === id) : undefined;

export const getIsland = (id: IslandId | null | undefined): Island | undefined =>
  id ? ISLANDS[id] : undefined;
