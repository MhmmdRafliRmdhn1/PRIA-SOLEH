import { makeProvince } from './helpers';

export const JAWA_PROVINCES = [
  makeProvince('jawa', {
    id: 'banten', name: 'Banten', capital: 'Serang', coord: [106.15, -6.12],
    emoji: '🏯', colors: ['#fff3d3', '#d9b158'], motif: 'zigzag',
    foods: [
      ['Sate Bandeng', 'Ikan bandeng tanpa duri yang diisi bumbu lalu dibakar.'],
      ['Rabeg', 'Gulai daging kambing berbumbu rempah yang dipengaruhi Timur Tengah.'],
      ['Nasi Sumsum', 'Nasi gurih dengan sumsum tulang sapi.']
    ],
    products: [
      ['Emping Melinjo', 'Camilan renyah dari biji melinjo Pandeglang.'],
      ['Golok Ciomas', 'Senjata tajam tradisional dengan reputasi kuat.'],
      ['Batik Banten', 'Batik dengan motif Surosowan dan kaligrafi tradisional.']
    ],
    arts: [
      ['Debus', 'Seni bela diri dan kekebalan yang berkembang di Banten.'],
      ['Rampak Bedug', 'Pertunjukan bedug berirama serempak.'],
      ['Angklung Buhun', 'Angklung tradisional masyarakat Baduy.']
    ],
    history: 'Kesultanan Banten berdiri pada abad ke-16 di bawah Maulana Hasanuddin dan menjadi pelabuhan lada utama di Selat Sunda. Peninggalannya meliputi Masjid Agung Banten dan Keraton Surosowan. Masyarakat Baduy di pedalaman tetap menjaga adat leluhur.'
  }),
  makeProvince('jawa', {
    id: 'dki', name: 'DKI Jakarta', capital: 'Jakarta', coord: [106.85, -6.21],
    emoji: '🏙️', colors: ['#fff6df', '#e3bb62'], motif: 'batik',
    foods: [
      ['Kerak Telor', 'Jajanan beras ketan dan telur dengan serundeng kelapa.'],
      ['Soto Betawi', 'Soto berkuah santan atau susu dengan daging dan jeroan.'],
      ['Gado-gado', 'Sayuran rebus dengan bumbu kacang.']
    ],
    products: [
      ['Batik Betawi', 'Batik dengan motif ondel-ondel dan flora kota.'],
      ['Miniatur Ondel-ondel', 'Suvenir kriya boneka besar khas Betawi.'],
      ['Produk Ekonomi Kreatif', 'Fesyen, kuliner, dan karya digital dari pusat bisnis nasional.']
    ],
    arts: [
      ['Ondel-ondel', 'Boneka raksasa pengusir bala dalam arak-arakan.'],
      ['Lenong', 'Teater rakyat Betawi yang jenaka.'],
      ['Tanjidor', 'Orkestra tiup rakyat dengan pengaruh Eropa.']
    ],
    history: 'Berawal dari pelabuhan Sunda Kelapa, kota ini direbut Fatahillah pada 1527 dan dinamai Jayakarta. Pada 1619 VOC mendirikan Batavia, dan di Jalan Pegangsaan Timur Proklamasi Kemerdekaan dibacakan pada 17 Agustus 1945.'
  }),
  makeProvince('jawa', {
    id: 'jabar', name: 'Jawa Barat', capital: 'Bandung', coord: [107.61, -6.92],
    emoji: '🎋', colors: ['#fff4d8', '#dcb45e'], motif: 'leaf',
    foods: [
      ['Batagor', 'Bakso tahu goreng bersaus kacang dari Bandung.'],
      ['Nasi Timbel', 'Nasi dibungkus daun pisang dengan ayam goreng dan lalapan.'],
      ['Peuyeum', 'Tapai singkong manis yang difermentasi.']
    ],
    products: [
      ['Batik Trusmi Cirebon', 'Batik pesisir dengan motif mega mendung.'],
      ['Keramik Plered', 'Gerabah dan keramik dari Purwakarta.'],
      ['Wayang Golek', 'Boneka kayu tiga dimensi buatan perajin Bandung.']
    ],
    arts: [
      ['Angklung', 'Alat musik bambu yang diakui UNESCO pada 2010.'],
      ['Jaipongan', 'Tari pergaulan dinamis berbasis gerak ketuk tilu.'],
      ['Degung', 'Gamelan Sunda yang lembut dan berirama tenang.']
    ],
    history: 'Tanah Sunda pernah dikuasai Kerajaan Tarumanegara pada abad ke-5 dan kemudian Pajajaran. Kesultanan Cirebon berdiri pada abad ke-15. Pada 1955, Bandung menjadi tuan rumah Konferensi Asia-Afrika, tonggak solidaritas bangsa-bangsa terjajah.'
  }),
  makeProvince('jawa', {
    id: 'jateng', name: 'Jawa Tengah', capital: 'Semarang', coord: [110.42, -6.97],
    emoji: '🛕', colors: ['#fff2d1', '#d8b055'], motif: 'batik',
    foods: [
      ['Lumpia Semarang', 'Lumpia isi rebung dan udang yang digoreng atau basah.'],
      ['Soto Kudus', 'Soto kerbau atau ayam berkuah bening.'],
      ['Timlo Solo', 'Sup bening dengan daging, hati ayam, dan telur pindang.']
    ],
    products: [
      ['Batik Pekalongan', 'Batik pesisir yang kaya warna dan motif flora.'],
      ['Batik Solo', 'Batik klasik sogan dari Laweyan dan Kauman.'],
      ['Mebel Ukir Jepara', 'Furnitur kayu dengan ukiran halus.']
    ],
    arts: [
      ['Wayang Kulit', 'Teater bayangan yang diakui UNESCO sejak 2008.'],
      ['Tari Bedhaya', 'Tarian keraton Surakarta yang anggun dan sakral.'],
      ['Kuda Lumping', 'Tari rakyat dengan kuda anyaman bambu.']
    ],
    history: 'Candi Borobudur dibangun pada masa Dinasti Syailendra (sekitar abad ke-8 hingga 9) dan menjadi Warisan Dunia UNESCO pada 1991. Pada abad ke-15 berdiri Kesultanan Demak, dan Perjanjian Giyanti 1755 membagi Mataram menjadi Surakarta dan Yogyakarta.'
  }),
  makeProvince('jawa', {
    id: 'diy', name: 'DI Yogyakarta', capital: 'Yogyakarta', coord: [110.36, -7.80],
    emoji: '👑', colors: ['#fff5d6', '#e2b95c'], motif: 'batik',
    foods: [
      ['Gudeg', 'Nangka muda dimasak lama dengan santan dan gula kelapa.'],
      ['Bakpia Pathok', 'Kue isi kacang hijau dari kawasan Pathuk.'],
      ['Sate Klathak', 'Sate kambing dengan tusuk jeruji besi.']
    ],
    products: [
      ['Batik Tulis Yogyakarta', 'Batik klasik dengan motif parang dan kawung.'],
      ['Perak Kotagede', 'Kerajinan perak filigri dari Kotagede.'],
      ['Gerabah Kasongan', 'Gerabah dan keramik dari Bantul.']
    ],
    arts: [
      ['Tari Serimpi', 'Tarian keraton yang lembut dan penuh makna.'],
      ['Gamelan', 'Orkestra perunggu Jawa yang diakui UNESCO pada 2021.'],
      ['Sendratari Ramayana', 'Pertunjukan epos Ramayana di Prambanan.']
    ],
    history: 'Yogyakarta lahir dari Perjanjian Giyanti pada 1755 dengan Sultan Hamengkubuwono I sebagai raja pertama. Kota ini menjadi ibu kota Republik Indonesia pada 1946–1949. Sumbu Filosofi Yogyakarta ditetapkan sebagai Warisan Dunia UNESCO pada 2023.'
  }),
  makeProvince('jawa', {
    id: 'jatim', name: 'Jawa Timur', capital: 'Surabaya', coord: [112.75, -7.25],
    emoji: '🐉', colors: ['#fff3d5', '#dbb35a'], motif: 'zigzag',
    foods: [
      ['Rawon', 'Sup daging hitam dengan kluwek.'],
      ['Rujak Cingur', 'Rujak sayur dan buah dengan petis dan cingur sapi.'],
      ['Lontong Balap', 'Lontong, tahu, lentho, dan tauge dengan kuah petis.']
    ],
    products: [
      ['Batik Madura', 'Batik bermotif berani dan warna kontras.'],
      ['Apel Batu', 'Apel segar dari dataran tinggi Malang dan Batu.'],
      ['Kopi Ijen', 'Kopi arabika dari lereng Ijen, Bondowoso.']
    ],
    arts: [
      ['Reog Ponorogo', 'Tarian dengan topeng singa barong raksasa, diakui UNESCO pada 2024.'],
      ['Ludruk', 'Teater rakyat Surabaya dengan lawakan dan kritik sosial.'],
      ['Karapan Sapi', 'Balap sapi tradisional Madura.']
    ],
    history: 'Kerajaan Majapahit berdiri pada 1293 dengan pusat di Trowulan, dan mencapai puncak kejayaan pada abad ke-14. Pertempuran Surabaya pada 10 November 1945 diperingati sebagai Hari Pahlawan.'
  })
];
