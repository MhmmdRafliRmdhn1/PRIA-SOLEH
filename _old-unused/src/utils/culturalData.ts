export interface CulturalExhibit {
  id: string;
  name: string;
  category: 'batik' | 'songket' | 'tenun' | 'busana';
  origin: string;
  province: string;
  era: string;
  description: string;
  philosophy: string;
  technique: string;
  materials: string[];
  sdg11Alignment: {
    target: string;
    description: string;
    impact: string;
  };
  productAction: {
    productTitle: string;
    artisanGroup: string;
    location: string;
    priceEstimation: string;
    description: string;
    authenticGuarantee: string;
  };
  sources: {
    institution: string;
    reference: string;
    year: string;
    url?: string;
  }[];
  verifiedStatus: 'Terverifikasi (Faktual)' | 'Rekonstruksi Visual Kurasi';
  modelPosition: [number, number, number];
  rotationY: number;
}

export const CULTURAL_EXHIBITS: CulturalExhibit[] = [
  {
    id: 'batik-parang-rusak',
    name: 'Batik Parang Rusak Barong',
    category: 'batik',
    origin: 'Keraton Kesultanan Yogyakarta & Kasunanan Surakarta',
    province: 'D.I. Yogyakarta / Jawa Tengah',
    era: 'Abad ke-16 (Era Sultan Agung Hanyakrakusuma)',
    description: 'Motif Parang Rusak merupakan salah satu motif batik larangan (geheime patronen) tertua di tanah Jawa. Ragam hiasnya menyerupai deburan ombak laut selatan yang menghantam karang cadas tanpa henti.',
    philosophy: 'Melambangkan keteguhan jiwa, pantang menyerah, pengendalian hawa nafsu kepemimpinan, dan kesinambungan perjuangan manusia dalam menegakkan kebenaran.',
    technique: 'Batik Tulis Tradisional Halus menggunakan Canting Tembaga (cecek & klowong) dengan perintang lilin malam alami, pewarnaan sogan alami (kulit kayu jambal, tingi, dan tegeran).',
    materials: ['Kain Mori Primissima', 'Malam Tawon Alami', 'Ekstrak Pewarna Sogan Pohon Mahoni & Tingi'],
    sdg11Alignment: {
      target: 'SDG 11.4: Memperkuat Upaya Perlindungan dan Pelestarian Warisan Budaya dan Alam Dunia',
      description: 'Preservasi digital 3D dan dokumentasi pengetahuan motif keraton menjaga transmisi nilai arsitektur dan kearifan lokal perkotaan Jawa dari degradasi urbanisasi modern.',
      impact: 'Mendukung ekonomi regeneratif pengrajin batik tulis mandiri serta mempertahankan identitas kultural lanskap budaya kota pusaka (historic urban landscapes).'
    },
    productAction: {
      productTitle: 'Selendang Sutra Batik Tulis Parang Barong Sogan',
      artisanGroup: 'Paguyuban Pembatik Giriloyo Imogiri',
      location: 'Bantul, D.I. Yogyakarta',
      priceEstimation: 'Rp 1.850.000',
      description: 'Karya tulis tangan autentik selama 45 hari kerja dengan teknik celupan warna sogan alami dari perajin generasi ke-4 Giriloyo.',
      authenticGuarantee: 'Sertifikasi Label Batik Mark Indonesia (SNI 0239:2014) & QR Traceability Pengrajin.'
    },
    sources: [
      {
        institution: 'UNESCO Intangible Cultural Heritage',
        reference: 'Indonesian Batik inscribed on the Representative List of the Intangible Cultural Heritage of Humanity',
        year: '2009',
        url: 'https://ich.unesco.org/en/RL/indonesian-batik-00170'
      },
      {
        institution: 'Kemendikbudristek RI (Direktorat Pelindungan Kebudayaan)',
        reference: 'Pencatatan Warisan Budaya Takbenda (WBTb) No. Registrasi 2010000001: Batik Indonesia',
        year: '2010'
      }
    ],
    verifiedStatus: 'Terverifikasi (Faktual)',
    modelPosition: [-4.5, 0, -6],
    rotationY: Math.PI / 4
  },
  {
    id: 'songket-palembang',
    name: 'Songket Palembang Lepus Bintang Berantai',
    category: 'songket',
    origin: 'Palembang',
    province: 'Sumatera Selatan',
    era: 'Tradisi Kemaharajaan Sriwijaya hingga Kesultanan Palembang Darussalam',
    description: 'Dikenal sebagai "Ratu Segala Kain" (The Queen of Fabrics). Songket Lepus dicirikan oleh bidang kain yang hampir seluruhnya tertutup oleh sulaman benang emas pakan tambahan berkualitas tinggi.',
    philosophy: 'Kilauan emas melambangkan kejayaan maritim masa lalu, kemurnian martabat pekerti, kemakmuran, dan keharmonisan tatanan sosial masyarakat.',
    technique: 'Tenun pakan tambahan (supplementary weft technique) manual menggunakan Alat Tenun Gedogan / ATBM kayu besi dengan kerapatan benang tinggi.',
    materials: ['Benang Sutra Mentah Pilihan', 'Benang Emas Cabutan Bersepuh Emas Murni', 'Pewarna Alami Kayu Secang'],
    sdg11Alignment: {
      target: 'SDG 11.4: Pelestarian Pusaka Budaya Material & Pemberdayaan Komunitas Berkelanjutan',
      description: 'Menjaga keberlangsungan sentra kriya tenun tradisional di kawasan permukiman bersejarah Tangga Buntung dan 30 Ilir Palembang.',
      impact: 'Mencegah kepunahan keahlian menenun benang emas rumit melalui transfer keahlian antar generasi di pusat pemukiman tepi Sungai Musi.'
    },
    productAction: {
      productTitle: 'Setelan Kain & Selendang Songket Lepus Emas Bintang',
      artisanGroup: 'Sanggar Tenun Asli Tangga Buntung',
      location: 'Palembang, Sumatera Selatan',
      priceEstimation: 'Rp 6.500.000',
      description: 'Ditenun secara manual selama 3 bulan oleh penenun ahli dengan benang emas berkualitas tinggi dan dasar benang sutra halus.',
      authenticGuarantee: 'Sertifikat Keaslian Tenun Tangan Asli Palembang & Hak Kekayaan Intelektual (KIK).'
    },
    sources: [
      {
        institution: 'Kemendikbudristek RI',
        reference: 'Warisan Budaya Takbenda Indonesia: Songket Palembang (Nomor Registrasi 201300009)',
        year: '2013'
      },
      {
        institution: 'Museum Balaputradeva & Dinas Kebudayaan Sumsel',
        reference: 'Katalog Koleksi Masterpiece Tekstil Tradisional Sumatera Selatan',
        year: '2018'
      }
    ],
    verifiedStatus: 'Terverifikasi (Faktual)',
    modelPosition: [4.5, 0, -6],
    rotationY: -Math.PI / 4
  },
  {
    id: 'tenun-ikat-sumba',
    name: 'Tenun Ikat Hinggi Sumba Timur',
    category: 'tenun',
    origin: 'Sumba Timur',
    province: 'Nusa Tenggara Timur',
    era: 'Tradisi Leluhur Marapu (Pra-Kolonial)',
    description: 'Hinggi adalah kain kebesaran adat pria Sumba yang ditenun dengan motif figuratif fauna seperti kuda kencana, rusa, udang, dan pohon tengkorak (Andung).',
    philosophy: 'Kuda melambangkan kehormatan dan ksatria, udang melambangkan kehidupan abadi (reinkarnasi), sedangkan pohon andung melambangkan pelindung keteraturan kosmis desa adat.',
    technique: 'Teknik ikat ganda lungsi tradisional, proses pewarnaan akar mengkudu (kombu) dan daun nila (wora) yang difermentasi selama berbulan-bulan hingga bertahun-tahun.',
    materials: ['Kapas Pintal Manual Lokal', 'Akar Pohon Mengkudu (Kombu)', 'Daun Nila Alami (Wora)', 'Lumpur Khusus Fiksasi'],
    sdg11Alignment: {
      target: 'SDG 11.4 & 11.a: Hubungan Positif Ekonomi, Sosial, dan Lingkungan Antara Wilayah Perkotaan dan Perdesaan',
      description: 'Menjaga keberlangsungan ekosistem pewarnaan nabati organik tanpa limbah sintetis kimiawi di kampung-kampung adat Sumba.',
      impact: 'Konservasi vegetasi hutan adat mengkudu dan nila serta ketahanan ekonomi mandiri bagi para ibu penenun pedesaan Sumba.'
    },
    productAction: {
      productTitle: 'Kain Tenun Hinggi Kombu Pewarna Alami Motif Kuda',
      artisanGroup: 'Koperasi Tenun Adat Kampung Raja Prailiu',
      location: 'Waingapu, Sumba Timur, NTT',
      priceEstimation: 'Rp 3.750.000',
      description: '100% kapas pintal tangan lokal dengan pewarnaan alami kombu dan wora asli melalui 42 tahap pengerjaan sakral.',
      authenticGuarantee: 'Label Indikasi Geografis (IG) Tenun Ikat Sumba Timur Terdaftar Kemenkumham RI.'
    },
    sources: [
      {
        institution: 'Kemendikbudristek RI',
        reference: 'Warisan Budaya Takbenda Indonesia: Tenun Ikat Sumba (Nomor Registrasi 201400144)',
        year: '2014'
      },
      {
        institution: 'Perpustakaan Nasional RI & Dokumentasi Adat Prailiu',
        reference: 'Monografi Ragam Hias Tekstil Tradisional Nusa Tenggara Timur',
        year: '2019'
      }
    ],
    verifiedStatus: 'Terverifikasi (Faktual)',
    modelPosition: [-5, 0, 0],
    rotationY: Math.PI / 2
  },
  {
    id: 'batik-megamendung',
    name: 'Batik Pesisir Megamendung Cirebon',
    category: 'batik',
    origin: 'Cirebon',
    province: 'Jawa Barat',
    era: 'Abad ke-15 (Akulturasi Putri Ong Tien & Sunan Gunung Jati)',
    description: 'Motif awan bergaya khas pesisiran Cirebon dengan gradasi warna berlapis (biasanya 5 hingga 7 gradasi) dari biru tua pekat hingga putih kebiruan.',
    philosophy: 'Awan pembawa hujan yang menyejukkan bumi, melambangkan watak kesabaran, kelapangan dada, dan kepala dingin dalam menyelesaikan persoalan masyarakat majemuk.',
    technique: 'Batik Tulis canting tembaga dengan teknik gradasi malam rumit (nyolet dan celup bertingkat) yang membutuhkan presisi tinggi.',
    materials: ['Kain Katun Kereta Kencana', 'Malam Parafin Khusus Cirebon', 'Pewarna Indigofera Tingtur'],
    sdg11Alignment: {
      target: 'SDG 11.4: Melestarikan Warisan Arsitektur dan Keragaman Budaya Kota Maritim Bersejarah',
      description: 'Mengintegrasikan kampung batik Trusmi sebagai kawasan cagar budaya hidup dan sentra ekonomi kreatif perkotaan Cirebon.',
      impact: 'Mendukung pariwisata perkotaan berbasis kearifan lokal yang ramah pejalan kaki dan bebas degradasi polusi industri massal.'
    },
    productAction: {
      productTitle: 'Kain Panjang Batik Tulis Megamendung 7 Gradasi Indigo',
      artisanGroup: 'Sanggar Batik Pusaka Trusmi',
      location: 'Plered, Cirebon, Jawa Barat',
      priceEstimation: 'Rp 1.450.000',
      description: 'Karya tulis canting asli Cirebon dengan kedalaman gradasi 7 sapuan warna biru legendaris.',
      authenticGuarantee: 'Sertifikat Kurasi Asli Batik Trusmi Cirebon & Kode Nomor Pengrajin.'
    },
    sources: [
      {
        institution: 'Kemendikbudristek RI',
        reference: 'Warisan Budaya Takbenda Indonesia: Megamendung Cirebon (Nomor Registrasi 2010000008)',
        year: '2010'
      },
      {
        institution: 'Keraton Kasepuhan Cirebon',
        reference: 'Arsip Naskah Sejarah Motif Ornamen Seni Rupa Pesisir Cirebon',
        year: '2015'
      }
    ],
    verifiedStatus: 'Terverifikasi (Faktual)',
    modelPosition: [5, 0, 0],
    rotationY: -Math.PI / 2
  },
  {
    id: 'busana-bundo-kanduang',
    name: 'Busana Adat Minangkabau Bundo Kanduang',
    category: 'busana',
    origin: 'Luhak Nan Tigo Minangkabau',
    province: 'Sumatera Barat',
    era: 'Tradisi Matrilineal Kuno Ranah Minang',
    description: 'Kelengkapan busana adat perempuan pemimpin suku (Limpapeh Rumah Nan Gadang) meliputi Tingkuluak Tanduk Rusa, Baju Batabua, Salempang Songket Silungkang, dan Saruang.',
    philosophy: 'Tingkuluak bertanduk melambangkan tidak membebani pikiran masyarakat, baju batabua bertabur emas melambangkan kekayaan budi pekerti dan peran penjaga harta pusaka kaum.',
    technique: 'Kombinasi konstruksi garmen beludru bersulam benang emas (karembik) dan tenun songket pakan tambahan Silungkang/Pandai Sikek.',
    materials: ['Kain Beludru Hitam Pekat', 'Benang Emas Bordir Tangan', 'Songket Pandai Sikek Benang Duo'],
    sdg11Alignment: {
      target: 'SDG 11.4 & 11.7: Tata Kelola Komunitas Inklusif & Ketahanan Permukiman Tradisional Nagari',
      description: 'Memperkuat peran sentral perempuan Minang (matrilineal) dalam menjaga integritas arsitektur Rumah Gadang dan nagari pusaka.',
      impact: 'Menjaga tata kelola komunal desa adat (Nagari) agar tetap tahan bencana dan mandiri secara sosial ekonomi.'
    },
    productAction: {
      productTitle: 'Salempang & Selendang Songket Pandai Sikek Benang Duo',
      artisanGroup: 'Keluarga Penenun Pandai Sikek',
      location: 'Tanah Datar, Sumatera Barat',
      priceEstimation: 'Rp 4.200.000',
      description: 'Ditenun dengan motif Saik Galamai dan Pucuak Rabuang autentik dengan kehalusan benang duo.',
      authenticGuarantee: 'Sertifikat Cagar Budaya Asli Pandai Sikek & Terverifikasi UNESCO Club.'
    },
    sources: [
      {
        institution: 'Kemendikbudristek RI',
        reference: 'Warisan Budaya Takbenda Indonesia: Tenun Songket Pandai Sikek (Nomor Registrasi 201400111)',
        year: '2014'
      },
      {
        institution: 'Lembaga Kerapatan Adat Alam Minangkabau (LKAAM)',
        reference: 'Buku Falsafah Adat Minangkabau: Adat Basandi Syarak, Syarak Basandi Kitabullah',
        year: '2020'
      }
    ],
    verifiedStatus: 'Terverifikasi (Faktual)',
    modelPosition: [-4.5, 0, 6],
    rotationY: (3 * Math.PI) / 4
  },
  {
    id: 'tenun-sa-dan-toraja',
    name: 'Tenun Khas Toraja Sa\'dan Pa\'teddong',
    category: 'tenun',
    origin: 'Tana Toraja & Toraja Utara',
    province: 'Sulawesi Selatan',
    era: 'Tradisi Aluk Todolo Pegunungan Toraja',
    description: 'Kain tenun sakral dengan ragam motif geometris tegas yang melambangkan status kehormatan keluarga dan bagian penting dalam ritual adat Rambu Solo\' serta Rambu Tuka\'.',
    philosophy: 'Motif Pa\'teddong (kepala kerbau) melambangkan kesejahteraan, kemakmuran, dan ketulusan pengorbanan sosial demi kebaikan keluarga besar.',
    technique: 'Tenun gendong tradisional bambu (Alat Tenun Pa\'tondon) yang dikerjakan duduk di lantai dengan pewarna alami getah daun dan tanah liat.',
    materials: ['Kapas Alam Toraja', 'Pewarna Alami Daun Bilalang', 'Pewarna Kuning Kunyit', 'Tanah Liat Fiksasi'],
    sdg11Alignment: {
      target: 'SDG 11.4: Perlindungan Kawasan Warisan Budaya Permukiman Tradisional Tongkonan Toraja',
      description: 'Mendukung pelestarian arsitektur vernakular desa adat Kete Kesu dan Pallawa melalui penguatan ekonomi perajin tenun setempat.',
      impact: 'Mempertahankan warisan budaya hidup (living heritage) di lanskap lanskap pegunungan Toraja dari ancaman komersialisasi tak terkendali.'
    },
    productAction: {
      productTitle: 'Kain Tenun Asli Sa\'dan Motif Pa\'teddong & Sekong Kandaure',
      artisanGroup: 'Sanggar Penenun Sa\'dan Malimbong',
      location: 'Toraja Utara, Sulawesi Selatan',
      priceEstimation: 'Rp 2.900.000',
      description: 'Tenun tangan tradisional 60 hari menggunakan pewarna alami tumbuhan hutan pegunungan Toraja.',
      authenticGuarantee: 'Sertifikasi Indikasi Geografis Tenun Toraja Kemenkumham RI.'
    },
    sources: [
      {
        institution: 'Kemendikbudristek RI',
        reference: 'Warisan Budaya Takbenda Indonesia: Tenun Sa\'dan Toraja (Nomor Registrasi 201500281)',
        year: '2015'
      },
      {
        institution: 'Dinas Kebudayaan dan Pariwisata Toraja Utara',
        reference: 'Dokumentasi Simbolisme Motif Ukir dan Tekstil Toraja',
        year: '2021'
      }
    ],
    verifiedStatus: 'Terverifikasi (Faktual)',
    modelPosition: [4.5, 0, 6],
    rotationY: -(3 * Math.PI) / 4
  }
];

