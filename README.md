# CultureVerse: Future Heritage Museum

Museum virtual 3D futuristik bernuansa putih & emas. Jelajahi lima pulau Indonesia (Papua, Kalimantan, Sumatera, Sulawesi, Jawa) beserta 33 provinsinya: makanan khas, produk unggulan, kesenian, dan sejarah.

**Stack:** React 18 · TypeScript · Vite · Three.js · React Three Fiber · Drei · Rapier

## Menjalankan (Wajib menggunakan pnpm)
```bash
pnpm install
pnpm dev        # pengembangan (jalankan web)
pnpm build      # produksi (tsc + vite)
pnpm preview    # pratinjau hasil build produksi
```
Atau cukup klik dua kali file `start.bat` di Windows Explorer.
Parameter URL: `?quality=high|low` memaksa profil kualitas (pantulan lantai nyata hanya di `high`).
Mode dev saja: `?globe=sumatera` memaksa target globe untuk debugging.

## Kontrol
| Aksi | Desktop | Mobile |
|---|---|---|
| Berjalan | W A S D / panah | Joystick kiri |
| Berlari | Shift | Dorong joystick penuh |
| Kamera | Drag mouse | Geser sisi kanan |
| Buka zona | E | Tombol E |
| Tutup panel | Esc | Tombol tutup |

## Struktur
```
src/
  data/            Konten (terpisah dari 3D)
    provinces/     Data 33 provinsi per pulau
    islands.ts     Meta 5 pulau
    geo/           Garis pantai (Natural Earth, disederhanakan)
  config/          layout aula & zona, profil kualitas
  state/           playerState (mutable, per-frame), museumStore (reaktif)
  components/3d/
    hall/          Lantai, arsitektur, kubah, plaza
    zones/         Zona pulau (hologram, pin, gerbang)
    globe/         Globe hologram + globeDirector (logika rotasi)
    avatar/        Avatar prosedural, slot GLB, fisika
  components/ui/   HUD, panel, minimap, kontrol mobile
```

## Menambah / mengubah konten
Edit `src/data/provinces/<pulau>.ts`. Tidak perlu menyentuh komponen 3D.

## Avatar
Letakkan `public/models/telkom-student.glb` untuk mengganti avatar prosedural (lihat `public/models/README.md`).
Logo resmi Telkom University tidak dibuat; patch dada adalah slot kosong untuk aset resmi.

## Catatan
- Sumber peta: Natural Earth (domain publik).
- Konten sejarah/budaya bersifat ringkasan umum; kurasi sebelum dipublikasikan.
