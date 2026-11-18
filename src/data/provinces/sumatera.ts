import { makeProvince } from './helpers';

export const SUMATERA_PROVINCES = [
  makeProvince('sumatera', {
    id: 'aceh', name: 'Aceh', capital: 'Banda Aceh', coord: [95.32, 5.55],
    emoji: '🕌', colors: ['#fff4d6', '#e8c46a'], motif: 'songket',
    foods: [
      ['Mie Aceh', 'Mi tebal berbumbu rempah kari, disajikan goreng, tumis, atau berkuah.'],
      ['Kuah Pliek U', 'Gulai sayur dengan bumbu pliek u, hasil fermentasi ampas kelapa.'],
      ['Ayam Tangkap', 'Ayam goreng yang ditumpuk daun pandan, kari, dan cabai hijau.']
    ],
    products: [
      ['Kopi Gayo', 'Kopi arabika dataran tinggi Gayo yang beraroma kuat dan berbody tebal.'],
      ['Minyak Nilam', 'Minyak atsiri nilam (patchouli), komoditas ekspor khas Aceh.'],
      ['Kerawang Gayo', 'Sulaman dan kriya bermotif Gayo pada kain dan perhiasan.']
    ],
    arts: [
      ['Tari Saman', 'Tarian duduk serempak dari Gayo, diakui UNESCO pada 2011.'],
      ['Tari Seudati', 'Tari laki-laki dengan hentakan dada, petikan jari, dan syair.'],
      ['Rapa’i Geleng', 'Pertunjukan rebana massal dengan gerak kepala dan badan seragam.']
    ],
    history: 'Aceh adalah pusat Kesultanan Aceh Darussalam yang berjaya pada abad ke-16 hingga ke-17, terutama di masa Sultan Iskandar Muda. Letaknya di ujung barat Selat Malaka menjadikannya pintu masuk perdagangan dan penyebaran Islam di Nusantara, sehingga dijuluki Serambi Mekkah.'
  }),
  makeProvince('sumatera', {
    id: 'sumut', name: 'Sumatera Utara', capital: 'Medan', coord: [98.67, 3.59],
    emoji: '🏞️', colors: ['#fff1cf', '#d9b45a'], motif: 'zigzag',
    foods: [
      ['Soto Medan', 'Soto berkuah santan gurih dengan rempah pekat.'],
      ['Arsik Ikan Mas', 'Masakan Batak berbumbu andaliman dan asam cikala.'],
      ['Bika Ambon', 'Kue berongga beraroma pandan dan santan khas Medan.']
    ],
    products: [
      ['Ulos Batak', 'Kain tenun adat Batak yang dipakai dalam upacara kehidupan.'],
      ['Kopi Mandailing & Sidikalang', 'Kopi dataran tinggi Sumatera Utara dengan karakter earthy.'],
      ['Kemenyan Humbang', 'Getah kemenyan dari dataran tinggi sekitar Danau Toba.']
    ],
    arts: [
      ['Tor-tor', 'Tari ritual Batak yang diiringi musik gondang.'],
      ['Gondang Sabangunan', 'Ansambel musik tradisional Batak Toba.'],
      ['Rumah Bolon', 'Arsitektur rumah adat Batak dengan atap melengkung.']
    ],
    history: 'Wilayah ini menjadi rumah bagi suku Batak di sekitar Danau Toba, danau vulkanik terbesar di Asia Tenggara. Di pesisir timur berdiri Kesultanan Deli, yang membangun Istana Maimun pada 1888 saat perkebunan tembakau berkembang pesat.'
  }),
  makeProvince('sumatera', {
    id: 'sumbar', name: 'Sumatera Barat', capital: 'Padang', coord: [100.35, -0.95],
    emoji: '🏠', colors: ['#fff6dc', '#e2b957'], motif: 'songket',
    foods: [
      ['Rendang', 'Daging dimasak lama dalam santan dan rempah hingga kering dan pekat.'],
      ['Sate Padang', 'Sate daging berkuah kental kuning atau merah.'],
      ['Dendeng Batokok', 'Dendeng sapi tipis yang dipukul lalu digoreng dengan sambal lado.']
    ],
    products: [
      ['Songket Pandai Sikek', 'Tenun songket benang emas dari Tanah Datar.'],
      ['Kerajinan Perak Koto Gadang', 'Perhiasan filigri perak halus dari Agam.'],
      ['Sulaman Bordir Minang', 'Bordir benang emas untuk busana adat.']
    ],
    arts: [
      ['Tari Piring', 'Tarian dengan piring di telapak tangan yang berputar lincah.'],
      ['Randai', 'Teater rakyat yang memadukan silat, nyanyian, dan drama.'],
      ['Silek Minangkabau', 'Seni bela diri tradisional dengan filosofi alam.']
    ],
    history: 'Sumatera Barat adalah tanah Minangkabau dengan sistem kekerabatan matrilineal. Pusat budayanya pernah berada di Kerajaan Pagaruyung, dan wilayah ini mencatat Perang Padri (1803–1838) yang melibatkan kaum adat, kaum agama, dan Belanda.'
  }),
  makeProvince('sumatera', {
    id: 'riau', name: 'Riau', capital: 'Pekanbaru', coord: [101.45, 0.51],
    emoji: '🛶', colors: ['#fff3d2', '#dcb35c'], motif: 'wave',
    foods: [
      ['Gulai Asam Pedas Patin', 'Ikan patin berkuah asam pedas khas Melayu Riau.'],
      ['Roti Jala', 'Roti berpola jaring yang disantap dengan kari.'],
      ['Bolu Kemojo', 'Kue lembut berbentuk bunga kemboja dari tepung dan santan.']
    ],
    products: [
      ['Minyak Kelapa Sawit', 'Salah satu penghasil sawit terbesar di Indonesia.'],
      ['Tenun Siak', 'Kain tenun songket Melayu dari bekas pusat Kesultanan Siak.'],
      ['Minyak dan Gas Bumi', 'Kawasan Riau menyumbang produksi minyak nasional.']
    ],
    arts: [
      ['Tari Zapin', 'Tari Melayu bernuansa Arab dengan langkah cepat berirama gambus.'],
      ['Pacu Jalur', 'Lomba perahu panjang di Sungai Kuantan.'],
      ['Mak Yong', 'Teater tari Melayu yang diakui UNESCO.']
    ],
    history: 'Riau dikenal sebagai tanah Melayu. Kesultanan Siak Sri Inderapura berdiri pada 1723 dan meninggalkan Istana Siak yang masih berdiri. Bahasa Melayu dari kawasan ini kelak menjadi dasar bahasa Indonesia.'
  }),
  makeProvince('sumatera', {
    id: 'kepri', name: 'Kepulauan Riau', capital: 'Tanjungpinang', coord: [104.45, 0.92],
    emoji: '🐚', colors: ['#fff6e0', '#e6c06a'], motif: 'wave',
    foods: [
      ['Gonggong', 'Siput laut rebus yang disantap dengan sambal.'],
      ['Otak-otak', 'Olahan ikan berbumbu yang dibakar dalam daun kelapa.'],
      ['Mi Lendir', 'Mi kuning bersaus kental dari udang dan kacang.']
    ],
    products: [
      ['Hasil Laut Kering', 'Ikan bilis dan udang kering dari perairan sekitar.'],
      ['Tenun Songket Lingga', 'Songket Melayu dari Lingga dan sekitarnya.'],
      ['Anyaman Pandan', 'Tikar dan tas anyaman dari daun pandan.']
    ],
    arts: [
      ['Gurindam Dua Belas', 'Karya sastra Raja Ali Haji tahun 1847.'],
      ['Tari Zapin', 'Tari pergaulan Melayu yang hidup di pulau-pulau Kepri.'],
      ['Mak Yong', 'Teater tradisional Melayu yang berkembang di kepulauan ini.']
    ],
    history: 'Kepulauan Riau menjadi jantung Kerajaan Riau-Lingga. Di Pulau Penyengat, Raja Ali Haji menulis karya bahasa Melayu yang ikut membentuk bahasa Indonesia. Posisinya di Selat Malaka menjadikannya jalur dagang penting sejak berabad-abad lalu.'
  }),
  makeProvince('sumatera', {
    id: 'jambi', name: 'Jambi', capital: 'Jambi', coord: [103.61, -1.61],
    emoji: '🛕', colors: ['#fff2d0', '#d7b155'], motif: 'batik',
    foods: [
      ['Tempoyak', 'Durian fermentasi yang dimasak menjadi lauk bersambal.'],
      ['Pindang Patin', 'Ikan patin berkuah asam segar khas Sumatera bagian tengah.'],
      ['Lempok Durian', 'Dodol manis dari daging durian.']
    ],
    products: [
      ['Karet Alam', 'Perkebunan karet adalah penopang ekonomi masyarakat Jambi.'],
      ['Kayu Manis Kerinci', 'Kulit kayu manis dari dataran tinggi Kerinci.'],
      ['Batik Jambi', 'Batik bermotif Batanghari dan flora lokal.']
    ],
    arts: [
      ['Tari Sekapur Sirih', 'Tari penyambutan tamu dengan persembahan sirih.'],
      ['Tari Rangguk', 'Tari rakyat dengan gerak serempak dan iringan rebana.'],
      ['Seloko Adat', 'Petuah berbentuk pepatah dalam adat Melayu Jambi.']
    ],
    history: 'Kompleks Candi Muarajambi di tepi Sungai Batanghari adalah salah satu situs percandian Buddha terluas di Asia Tenggara, berkaitan dengan Kerajaan Melayu Kuno dan masa Sriwijaya. Jambi kemudian menjadi pusat Kesultanan Jambi.'
  }),
  makeProvince('sumatera', {
    id: 'sumsel', name: 'Sumatera Selatan', capital: 'Palembang', coord: [104.76, -2.99],
    emoji: '🍜', colors: ['#fff5d8', '#e5b94f'], motif: 'songket',
    foods: [
      ['Pempek', 'Olahan ikan dan sagu disantap dengan kuah cuko pedas-asam.'],
      ['Tekwan', 'Bakso ikan dengan kuah udang dan jamur.'],
      ['Mi Celor', 'Mi berkuah santan dan kaldu udang.']
    ],
    products: [
      ['Songket Palembang', 'Kain tenun benang emas yang dijuluki ratu segala kain.'],
      ['Kain Jumputan', 'Kain ikat-celup dengan warna cerah.'],
      ['Ukiran Kayu Palembang', 'Ukiran emas pada furnitur dan lemari khas Palembang.']
    ],
    arts: [
      ['Tari Gending Sriwijaya', 'Tarian agung penyambutan tamu kehormatan.'],
      ['Tari Tanggai', 'Tarian jari lentik dengan kuku palsu emas.'],
      ['Dul Muluk', 'Teater rakyat Palembang dengan syair dan humor.']
    ],
    history: 'Palembang adalah pusat Kerajaan Sriwijaya, kemaharajaan maritim yang berjaya sejak abad ke-7. Sungai Musi menjadi urat nadi perdagangannya. Kemudian berdiri Kesultanan Palembang Darussalam, dan kota ini kini terkenal dengan Jembatan Ampera.'
  }),
  makeProvince('sumatera', {
    id: 'bengkulu', name: 'Bengkulu', capital: 'Bengkulu', coord: [102.26, -3.80],
    emoji: '🌸', colors: ['#fff6e2', '#e0b960'], motif: 'leaf',
    foods: [
      ['Pendap', 'Ikan dan kelapa berbumbu yang dibungkus daun talas lalu dikukus atau dibakar.'],
      ['Bagar Hiu', 'Masakan pesisir Bengkulu dengan bumbu kuning pekat.']
    ],
    products: [
      ['Batik Besurek', 'Batik dengan motif kaligrafi Arab dan bunga rafflesia.'],
      ['Kopi Robusta Kepahiang', 'Kopi robusta dataran tinggi Bengkulu.'],
      ['Anyaman Rotan', 'Kerajinan rotan untuk perabot dan wadah.']
    ],
    arts: [
      ['Tabut', 'Festival tahunan dengan replika tabut dan arak-arakan.'],
      ['Tari Andun', 'Tari pergaulan Bengkulu Selatan yang gembira.'],
      ['Dol', 'Musik perkusi yang mengiringi perayaan Tabut.']
    ],
    history: 'Inggris membangun Fort Marlborough pada awal abad ke-18 untuk perdagangan lada, dan benteng ini masih berdiri. Bengkulu juga dikenang sebagai tempat pengasingan Ir. Soekarno pada 1938 hingga 1942, serta kampung halaman Fatmawati.'
  }),
  makeProvince('sumatera', {
    id: 'lampung', name: 'Lampung', capital: 'Bandar Lampung', coord: [105.27, -5.45],
    emoji: '☕', colors: ['#fff3d4', '#dcb255'], motif: 'zigzag',
    foods: [
      ['Seruit', 'Ikan bakar dengan sambal terasi, tempoyak, dan lalapan.'],
      ['Pindang Ikan', 'Ikan berkuah asam pedas khas Lampung.'],
      ['Keripik Pisang', 'Camilan pisang renyah dengan beragam rasa.']
    ],
    products: [
      ['Kopi Robusta Lampung', 'Salah satu sentra robusta terbesar di Indonesia.'],
      ['Tapis', 'Kain tenun bersulam benang emas khas Lampung.'],
      ['Keripik Pisang', 'Produk oleh-oleh unggulan dari kebun pisang setempat.']
    ],
    arts: [
      ['Tari Sigeh Penguten', 'Tari penyambutan tamu dengan siger emas.'],
      ['Tari Melinting', 'Tari klasik dari lingkungan adat Melinting.'],
      ['Siger', 'Mahkota emas bertingkat yang menjadi lambang Lampung.']
    ],
    history: 'Lampung berada di ujung selatan Sumatera dan menjadi gerbang menuju Jawa. Letusan Krakatau pada 1883 mengguncang Selat Sunda. Pada 1905, program kolonisasi memindahkan penduduk Jawa ke wilayah ini, cikal bakal transmigrasi.'
  }),
  makeProvince('sumatera', {
    id: 'babel', name: 'Kepulauan Bangka Belitung', capital: 'Pangkalpinang', coord: [106.11, -2.13],
    emoji: '⛏️', colors: ['#fff4dc', '#e1b85c'], motif: 'dots',
    foods: [
      ['Lempah Kuning', 'Sup ikan berkuah kuning asam segar.'],
      ['Mi Bangka', 'Mi kuning dengan kuah kaldu dan topping gurih.'],
      ['Martabak Bangka', 'Martabak manis tebal dengan isian melimpah.']
    ],
    products: [
      ['Lada Putih Muntok', 'Lada putih dari Bangka dengan perlindungan indikasi geografis.'],
      ['Timah', 'Penambangan timah telah menjadi identitas ekonomi pulau ini.'],
      ['Kain Cual', 'Tenun khas Bangka dengan motif ikat berwarna cerah.']
    ],
    arts: [
      ['Tari Campak', 'Tari pergaulan Melayu Bangka dengan pantun.'],
      ['Dambus', 'Alat musik petik khas Bangka Belitung.'],
      ['Perang Ketupat', 'Tradisi masyarakat Tempilang untuk tolak bala.']
    ],
    history: 'Bangka dan Belitung terkenal karena timah, yang ditambang sejak abad ke-18 dan memicu kedatangan pekerja Tionghoa. Muntok pernah menjadi tempat pengasingan tokoh pergerakan nasional dan menjadi bagian dari sejarah perundingan kemerdekaan.'
  })
];
