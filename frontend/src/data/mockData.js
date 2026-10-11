// O'zbekiston hududlari, turlar, kottejlar, restoranlar va xizmatlar ma'lumotlari

export const REGIONS_DATA = [
  {
    id: 'all',
    name: 'Barchasi',
    shortName: 'Barchasi',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    description: "O'zbekiston bo'ylab barcha sayyohlik maskanlari",
    lat: 41.311081,
    lng: 69.240562,
    zoom: 6,
  },
  {
    id: 'tashkent-city',
    name: 'Toshkent shahri',
    shortName: 'Toshkent sh.',
    image: 'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=600&q=80',
    description: "Markaziy Osiyoning yirik megapolisi, Chorsu, Magic City va zamonaviy xiyobonlar",
    lat: 41.311081,
    lng: 69.240562,
    zoom: 12,
  },
  {
    id: 'tashkent-region',
    name: 'Toshkent viloyati',
    shortName: 'Toshkent vil.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    description: "Chorvoq suv ombori, Amirsoy tog' kurorti, Chimgan va Bo'stonliq dachalar maskani",
    lat: 41.5200,
    lng: 70.0300,
    zoom: 10,
  },
  {
    id: 'samarkand',
    name: 'Samarqand',
    shortName: 'Samarqand',
    image: 'https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=600&q=80',
    description: "Yer yuzining sayqali, Registon maydoni, Go'ri Amir, Shohi Zinda va Boqiy Shahar",
    lat: 39.6542,
    lng: 66.9597,
    zoom: 12,
  },
  {
    id: 'bukhara',
    name: 'Buxoro',
    shortName: 'Buxoro',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
    description: "Sharq gavhari, Minorai Kalon, Ark qal'asi, Labi Hovuz va qadimiy karvonsaroylar",
    lat: 39.7747,
    lng: 64.4286,
    zoom: 12,
  },
  {
    id: 'khorezm',
    name: 'Xorazm (Xiva)',
    shortName: 'Xiva',
    image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=600&q=80',
    description: "Ochiq osmon ostidagi muzey Ichan Qala, Kalta Minor va Xiva xonlari saroylari",
    lat: 41.3783,
    lng: 60.3639,
    zoom: 12,
  },
  {
    id: 'andijan',
    name: 'Andijon',
    shortName: 'Andijon',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    description: "Bobur yurti, Bog'i Bobur, Xonobod shifobaxsh sohillari va vodiylarning go'zal havosi",
    lat: 40.7821,
    lng: 72.3442,
    zoom: 11,
  },
  {
    id: 'fergana',
    name: 'Farg\'ona',
    shortName: 'Farg\'ona',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80',
    description: "Marg'ilon ipakchiligi, Qo'qon Xudoyorxon o'rdasi va Rishton kulolchilik san'ati",
    lat: 40.3842,
    lng: 71.7843,
    zoom: 11,
  },
  {
    id: 'namangan',
    name: 'Namangan',
    shortName: 'Namangan',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80',
    description: "Gullar shahri, Chortoq shifobaxsh ma'danli suvlari va Afsonalar Vodiysi bog'i",
    lat: 40.9983,
    lng: 71.6726,
    zoom: 11,
  },
  {
    id: 'qashqadaryo',
    name: 'Qashqadaryo (Shahrisabz)',
    shortName: 'Shahrisabz',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    description: "Amir Temur vatani Oqsaroy, Kitob baland tog' rasadxonasi va xushbo'y go'sht tansig'i",
    lat: 39.0560,
    lng: 66.8335,
    zoom: 11,
  },
  {
    id: 'surxondaryo',
    name: 'Surxondaryo (Termiz)',
    shortName: 'Termiz',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: "Fayoztepa budda ibodatxonasi, Hakim at-Termiziy majmuasi va Boysun tog'lari",
    lat: 37.2242,
    lng: 67.2783,
    zoom: 11,
  },
  {
    id: 'jizzakh',
    name: 'Jizzax (Zomin)',
    shortName: 'Zomin',
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=600&q=80',
    description: "O'zbekiston Shveytsariyasi, archazor tog'lar, shisha ko'prik va toza tog' havosi",
    lat: 39.9606,
    lng: 68.4950,
    zoom: 10,
  },
  {
    id: 'sirdaryo',
    name: 'Sirdaryo',
    shortName: 'Sirdaryo',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
    description: "Buyuk daryo bo'yi, baliqchilik va qovun polizlarining betakror makoni",
    lat: 40.4983,
    lng: 68.7833,
    zoom: 11,
  },
  {
    id: 'navoiy',
    name: 'Navoiy',
    shortName: 'Navoiy',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    description: "Aydarko'l sohili, Sarmishsoy qoyatosh rasmlari va Nurota Chashma muqaddas bulog'i",
    lat: 40.0844,
    lng: 65.3792,
    zoom: 11,
  },
  {
    id: 'karakalpakstan',
    name: 'Qoraqalpog\'iston (Mo\'ynoq/Nukus)',
    shortName: 'Qoraqalpog\'iston',
    image: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
    description: "Savitskiy nomidagi jahon muzeyi, Mo'ynoq kemalar qabristoni va Orol dengizi fojiasi",
    lat: 43.7683,
    lng: 59.0214,
    zoom: 9,
  }
];

// Soxta e'lonlar tozalangan - Faqat backenddan (API orqali) kelayotgan haqiqiy ma'lumotlar ko'rinadi
export const COTTAGES_DATA = [];
export const RESTAURANTS_DATA = [];
export const HOTELS_DATA = [];
export const POSTS_DATA = [];
export const TOURS_DATA = [];
export const INITIAL_VERIFICATIONS = [];
export const TAXIS_DATA = [];
export const GUIDES_DATA = [];

// Poyezd Biletlari (Train routes)
export const TRAIN_ROUTES = [
  {
    id: 't-1',
    trainNumber: '762Ф "Afrosiyob"',
    operator: "O'zbekiston Temir Yo'llari",
    trainType: 'Tezyurar poyezd',
    from: 'Toshkent Markaziy',
    to: 'Samarqand',
    departureDate: '2026-10-15',
    departure: '2026-10-15 08:00',
    arrival: '2026-10-15 10:15',
    duration: '2s 15d',
    classes: [
      { name: 'VIP', price: "350 000 so'm", priceNum: 350000, seats: 8 },
      { name: 'Biznes', price: "240 000 so'm", priceNum: 240000, seats: 16 },
      { name: 'Ekonom', price: "170 000 so'm", priceNum: 170000, seats: 45 }
    ]
  },
  {
    id: 't-2',
    trainNumber: '764Ф "Afrosiyob"',
    operator: "O'zbekiston Temir Yo'llari",
    trainType: 'Tezyurar poyezd',
    from: 'Toshkent Markaziy',
    to: 'Buxoro 1 (Kogon)',
    departureDate: '2026-10-15',
    departure: '2026-10-15 08:30',
    arrival: '2026-10-15 12:45',
    duration: '4s 15d',
    classes: [
      { name: 'VIP', price: "480 000 so'm", priceNum: 480000, seats: 4 },
      { name: 'Biznes', price: "340 000 so'm", priceNum: 340000, seats: 12 },
      { name: 'Ekonom', price: "240 000 so'm", priceNum: 240000, seats: 30 }
    ]
  }
];

// Aviabiletlar (Flight routes)
export const FLIGHT_ROUTES = [
  {
    id: 'f-1',
    flightNumber: 'HY-051',
    airline: 'Uzbekistan Airways',
    from: 'Toshkent (TAS)',
    to: 'Urganch / Xiva (UGC)',
    departure: '07:30',
    arrival: '09:00',
    duration: '1s 30d',
    price: "450 000 so'm",
    priceNum: 450000,
    seats: 18,
    baggage: '23 kg + 8 kg qo\'l yuki',
    cabinClass: 'Ekonom'
  },
  {
    id: 'f-2',
    flightNumber: 'HY-011',
    airline: 'Uzbekistan Airways',
    from: 'Toshkent (TAS)',
    to: 'Nukus (NCU)',
    departure: '09:15',
    arrival: '11:00',
    duration: '1s 45d',
    price: "520 000 so'm",
    priceNum: 520000,
    seats: 12,
    baggage: '23 kg + 8 kg qo\'l yuki',
    cabinClass: 'Ekonom'
  }
];

// Shaharlararo Avtobuslar (Intercity buses)
export const BUS_ROUTES = [
  {
    id: 'b-1',
    busNumber: 'UZ-841 Express',
    operator: 'Toshkent Avtovokzal MCHJ',
    from: 'Toshkent ("Olmazor" Avtovokzali)',
    to: 'Samarqand Markaziy Avtoshoxobcha',
    departure: '08:00',
    arrival: '12:30',
    duration: '4s 30d',
    price: "65 000 so'm",
    priceNum: 65000,
    seats: 24,
    busModel: 'Yutong ZK6122 Luxury (Wi-Fi, Konditsioner)'
  }
];

// Milliy Taomlar Menusi (Food delivery / ordering)
export const FOOD_MENU = [
  {
    id: 'fm-1',
    title: "To'y Oshi (Samarqandcha)",
    category: 'osh',
    price: "45 000 so'm",
    priceNum: 45000,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80',
    description: "Devzira guruch, barra qo'zichoq go'shti, sariq sabzi, mayiz va no'xat bilan damlangan mashhur palov",
    prepTime: '20-25 daqiqa'
  }
];

// Diqqatga Sazovor Joylar Chiptalari (Museum & attraction tickets)
export const ATTRACTIONS_DATA = [
  {
    id: 'att-1',
    title: "Registon Maydoni (3 ta Madrassa)",
    city: 'Samarqand',
    location: 'Registon maydoni, Samarqand',
    price: "35 000 so'm",
    priceNum: 35000,
    foreignerPrice: "65 000 so'm",
    rating: 4.98,
    reviewsCount: 342,
    openHours: '08:00 – 20:00 (Har kuni)',
    image: 'https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=800&q=80',
    description: "Ulug'bek, Tillakori va Sherdor madrasalaridan iborat jahon durdonasi."
  }
];
