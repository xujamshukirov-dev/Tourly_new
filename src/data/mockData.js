// O'zbekiston hududlari, turlar, kottejlar, restoranlar va xizmatlar uchun to'liq mock ma'lumotlar

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

// Uy va Dachalar (Home rent & Cottages)
export const COTTAGES_DATA = [
  {
    id: 1,
    title: "Javohir Samadov",
    regionId: "surxondaryo",
    regionName: "Omonxona",
    hostName: "Javohir Samadov",
    hostPhone: "+998 90 123 45 67",
    hostAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    price: "1 800 000 so'm / kun",
    priceNum: 1800000,
    rating: 4.9,
    reviewsCount: 38,
    bedrooms: 4,
    bathrooms: 3,
    capacity: "12 kishilik",
    hasPool: true,
    hasSauna: true,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 38.3500,
    lng: 67.4500,
    address: "Omonxona shifobaxsh maskani, Boysun",
    description: "Omonxona tog'lari qo'ynida joylashgan an'anaviy shinam kottej. Toza shifobaxsh buloq suvi, o'ymakor ustunlar, milliy ayvon va sokin tabiat."
  },
  {
    id: 2,
    title: "Zomin Tog' Shamoli Kottej",
    regionId: "jizzakh",
    regionName: "Jizzax, Zomin",
    hostName: "Botirbek Aliyev",
    hostPhone: "+998 91 987 65 43",
    hostAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    price: "1 200 000 so'm / kun",
    priceNum: 1200000,
    rating: 4.8,
    reviewsCount: 29,
    bedrooms: 3,
    bathrooms: 2,
    capacity: "8-10 kishilik",
    hasPool: true,
    hasSauna: false,
    images: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 39.6800,
    lng: 68.5200,
    address: "Zomin Milliy Bog'i, archazor yo'li",
    description: "Zomin tog'larining eng xushmanzara joyida joylashgan yog'och kottej. Toza tog' havosi, shaxsiy mangal va tandir maydoni."
  },
  {
    id: 3,
    title: "Amirsoy Chalet & Spa Villa",
    regionId: "tashkent-region",
    regionName: "Toshkent viloyati, Amirsoy",
    hostName: "Asilbek Dinurov",
    hostPhone: "+998 93 555 77 88",
    hostAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    price: "2 500 000 so'm / kun",
    priceNum: 2500000,
    rating: 5.0,
    reviewsCount: 52,
    bedrooms: 5,
    bathrooms: 4,
    capacity: "14 kishilik",
    hasPool: true,
    hasSauna: true,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.5360,
    lng: 70.0150,
    address: "Amirsoy kurorti yaqinida, Chimgan",
    description: "Premium alpiya uslubidagi shalye. Issiq suvli jakuzi, kamin, zamonaviy oshxona va chang'i yo'laklariga yaqin."
  },
  {
    id: 4,
    title: "Registon Garden Guest Villa",
    regionId: "samarkand",
    regionName: "Samarqand shahri",
    hostName: "Shohruh Mirzo",
    hostPhone: "+998 94 333 22 11",
    hostAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    price: "900 000 so'm / kun",
    priceNum: 900000,
    rating: 4.8,
    reviewsCount: 44,
    bedrooms: 3,
    bathrooms: 2,
    capacity: "6-8 kishilik",
    hasPool: false,
    hasSauna: false,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 39.6580,
    lng: 66.9720,
    address: "Registon maydonidan 5 daqiqalik piyoda yo'l",
    description: "Samarqand an'anaviy me'morchiligi bilan uyg'unlashgan hovlili shinam mehmonxona-villa. Mevali bog' va sokin muhit."
  },
  {
    id: 5,
    title: "Xiva Ichan Qala Oriental Home",
    regionId: "khorezm",
    regionName: "Xiva, Ichan Qala",
    hostName: "Gulnora Boboyeva",
    hostPhone: "+998 90 777 88 99",
    hostAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    price: "750 000 so'm / kun",
    priceNum: 750000,
    rating: 4.9,
    reviewsCount: 31,
    bedrooms: 2,
    bathrooms: 2,
    capacity: "5 kishilik",
    hasPool: false,
    hasSauna: false,
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.3780,
    lng: 60.3590,
    address: "Ichan Qala ichki ko'chasi, Pahlavon Mahmud yonida",
    description: "Haqiqiy Xiva xonligi muhiti, o'yma naqshli yog'och ustunlar, milliy gilamlar va tonggi qadimiy shahar manzarasi."
  }
];

// Restoranlar va Milliy Taomlar (Restaurants & National Cuisines)
export const RESTAURANTS_DATA = [
  {
    id: 101,
    name: "Muslima Jumayeva",
    regionId: "tashkent-city",
    regionName: "Toshkent shahri",
    hostName: "Muslima Jumayeva",
    categoryBadge: "Milliy Oshxona",
    cuisine: "Milliy",
    rating: 4.9,
    reviewsCount: 142,
    priceLevel: "$$",
    openTime: "10:00 - 23:00",
    phone: "+998 71 200 11 22",
    images: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.3275,
    lng: 69.2360,
    address: "Shayxontohur tumani, Chorsu milliy taomlar xiyoboni",
    description: "Muslima Jumayeva oilaviy milliy oshxonasi. Qadimiy retseptlar asosida pishirilgan to'y oshi, nozik tandir somsa va shirin choylar."
  },
  {
    id: 102,
    name: "Afrosiyob Samarkand Palov",
    regionId: "samarkand",
    regionName: "Samarqand shahri",
    hostName: "Usta Farhod",
    categoryBadge: "Ziyofat & Palov",
    cuisine: "Samarqandcha ziqirli osh, Shashlik, Manti",
    rating: 4.8,
    reviewsCount: 98,
    priceLevel: "$$$",
    openTime: "11:00 - 22:00",
    phone: "+998 66 233 44 55",
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 39.6610,
    lng: 66.9650,
    address: "Universitet xiyoboni, Registon yaqinida",
    description: "Samarqandning mashhur qavat-qavat tayyorlanadigan mayin go'shtli va sariq sabzili ziqir oshi."
  },
  {
    id: 103,
    name: "Xorazm Tuxum-Barak & Shivit Oshi",
    regionId: "khorezm",
    regionName: "Xiva",
    hostName: "Anvarjon Matyoqubov",
    categoryBadge: "Qadimiy Taomlar",
    cuisine: "Tuxum barak, Shivit oshi, Xiva qovurilgan balig'i",
    rating: 5.0,
    reviewsCount: 86,
    priceLevel: "$$",
    openTime: "09:00 - 23:00",
    phone: "+998 62 227 12 34",
    images: [
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.3775,
    lng: 60.3605,
    address: "Ichan Qala Islom Xo'ja minorasi qarshisida",
    description: "Faqat Xorazmga xos bo'lgan yashil shivit oshi va nozik tuxum barak taomlarining eng lazzatlisi."
  },
  {
    id: 104,
    name: "Labi Hovuz Choyxonasi",
    regionId: "bukhara",
    regionName: "Buxoro shahri",
    hostName: "Sirojiddin Rahimov",
    categoryBadge: "Tarixiy Choyxona",
    cuisine: "Buxorocha osh-sofi, G'ijduvon shashlik, Ko'k choy & Holva",
    rating: 4.8,
    reviewsCount: 115,
    priceLevel: "$$",
    openTime: "08:00 - 23:30",
    phone: "+998 65 224 88 99",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 39.7730,
    lng: 64.4215,
    address: "Buxoro, Labi Hovuz ansambli bo'yida",
    description: "Asriy tut daraxtlari soyasida, suv bo'yida o'tirib Buxoro taomlari va xushbo'y ziravorli choydan bahramand bo'ling."
  }
];

// Mehmonxonalar va Sanatoriylar (Hotels & Sanatoriums)
export const HOTELS_DATA = [
  {
    id: 201,
    name: "Asilbek Dinarov",
    regionId: "tashkent-city",
    regionName: "Toshkent",
    hostName: "Asilbek Dinarov",
    stars: 5,
    rating: 4.98,
    reviewsCount: 210,
    pricePerNight: "1 450 000 so'm",
    priceNum: 1450000,
    phone: "+998 71 230 00 00",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.311081,
    lng: 69.240562,
    address: "Toshkent shahri, Yakkasaroy tumani, Shota Rustaveli",
    amenities: ["Spa & Wellness", "Basseyn", "Restoranlar", "Konferents zallari", "Wi-Fi", "O'tkazish xizmati"],
    description: "Asilbek Dinarov boshqaruvidagi sharqona hashamatli butik mehmonxona. Oqshomgi sokin basseyn, milliy o'ymakor naqshlar va yuqori darajadagi xizmat."
  },
  {
    id: 202,
    name: "Zomin Sanatoriysi & Tog' Sog'lomlashtirish",
    regionId: "jizzakh",
    regionName: "Jizzax, Zomin",
    stars: 4,
    rating: 4.85,
    reviewsCount: 164,
    pricePerNight: "650 000 so'm (davolash bilan)",
    priceNum: 650000,
    phone: "+998 72 226 15 15",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 39.6600,
    lng: 68.5100,
    address: "Turkiston tizmasi shimoliy yonbag'ri, 2000m balandlik",
    amenities: ["Nafas yo'llari davolash", "Tog' havosi", "Fizioterapiya", "3 mahal parhez taom", "Tog' piyoda yo'laklari"],
    description: "Dengiz sathidan 2000 metr balandlikdagi archazorlar qo'ynida nafas yo'llari va asab tizimini shifolash maskani."
  },
  {
    id: 203,
    name: "Orient Star Khiva Madrasah Hotel",
    regionId: "khorezm",
    regionName: "Xiva, Ichan Qala",
    stars: 4,
    rating: 4.88,
    reviewsCount: 180,
    pricePerNight: "850 000 so'm",
    priceNum: 850000,
    phone: "+998 62 227 80 80",
    images: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.3782,
    lng: 60.3585,
    address: "Muhammad Aminxon madrasasi, Ichan Qala",
    amenities: ["Tarixiy xonalar", "Nonushta qo'shilgan", "Ekskursiyalar", "Restoran", "Hovli"],
    description: "XIX asrga oid haqiqiy madrasada joylashgan betakror mehmonxona. Qadimiy xujralar zamonaviy qulayliklar bilan jihozlangan."
  },
  {
    id: 204,
    name: "Hyatt Regency Tashkent",
    regionId: "tashkent-city",
    regionName: "Toshkent shahri",
    stars: 5,
    rating: 4.96,
    reviewsCount: 310,
    pricePerNight: "2 100 000 so'm",
    priceNum: 2100000,
    phone: "+998 71 207 12 34",
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=800&q=80"
    ],
    lat: 41.3160,
    lng: 69.2790,
    address: "Navoiy ko'chasi 1A, Mustaqillik maydoni yonida",
    amenities: ["Spa & Fitnes", "Ochiq va yopiq basseyn", "Italyan restorani Sette", "Panoramik barlar"],
    description: "Poytaxt markazidagi eng nufuzli 5 yulduzli lyuks mehmonxona. Shaharning biznes va madaniy nuqtalariga bir necha qadam."
  }
];

// So'nggi Postlar va Reels (Latest Posts & Traveler Stories)
export const POSTS_DATA = [
  {
    id: 301,
    author: "Asilbek Dinarov",
    authorRole: "Mehmonxona Muassisi",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    location: "Toshkent shahri",
    regionId: "tashkent-city",
    timeAgo: "1 soat oldin",
    likes: 1420,
    commentsCount: 68,
    isLiked: false,
    isSaved: false,
    caption: "Toshkent oqshomining jozibasi va sharqona sokinlik. Hovli bog'i va shinam ayvonlarimizda dam olish zavqi! ✨🏛️",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=60",
    videoUrl: null
  },
  {
    id: 302,
    author: "Usta Farhod",
    authorRole: "Milliy Oshxona Ustasi",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    location: "Samarqand — Chorsu",
    regionId: "samarkand",
    timeAgo: "3 soat oldin",
    likes: 2890,
    commentsCount: 145,
    isLiked: true,
    isSaved: true,
    caption: "Tandirdan hozirgina uzilgan qarsildoq va xushbo'y go'shtli somsa! Sayohatchilar uchun eng sevimli milliy lazzat 🥟🔥",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=60",
    videoUrl: null
  },
  {
    id: 303,
    author: "Zarina Karimova",
    authorRole: "Sayyoh & Talaba",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    location: "Samarqand & Toshkent",
    regionId: "samarkand",
    timeAgo: "5 soat oldin",
    likes: 1950,
    commentsCount: 92,
    isLiked: false,
    isSaved: false,
    caption: "O'qish va sayohatni birga olib borish ajoyib! O'zbekistonning tarixiy shaharlari har safar yangi ilhom bag'ishlaydi 📚🎒🇺🇿",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=60",
    videoUrl: null
  },
  {
    id: 304,
    author: "Javohir Samadov",
    authorRole: "Sayyoh & Blogger",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    location: "Omonxona & Boysun",
    regionId: "surxondaryo",
    timeAgo: "Kecha",
    likes: 1640,
    commentsCount: 81,
    isLiked: false,
    isSaved: false,
    caption: "Tog'lar sari yangi marshrut! O'zbekiston bo'ylab do'stlar bilan sayohat qilish — unutilmas xotiralar manbai 🌄🗺️",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=60",
    videoUrl: null
  }
];

// Tayyor Tur Paketlar (Tour packages for sale & comparison)
export const TOURS_DATA = [
  {
    id: 401,
    title: "Buyuk Ipak Yo'li Bo'ylab 4 Kunlik VIP Sayohat",
    companyName: "Silk Road Voyages LLC",
    companyVerified: true,
    regionId: "samarkand",
    route: "Toshkent — Samarqand — Buxoro — Toshkent",
    duration: "4 kun / 3 kecha",
    price: "2 800 000 so'm",
    priceNum: 2800000,
    rating: 4.95,
    reviewsCount: 88,
    included: ["Afrosiyob poyezd chiptalari", "4* mehmonxonalar", "Nonushta va tushlik", "Professional gid", "Kirish chiptalari"],
    image: "https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=800&q=80",
    description: "Samarqandning mahobatli Registoni, Buxoroning asriy ko'chalari va Labi Hovuz madaniyati bo'ylab unutilmas sayohat."
  },
  {
    id: 402,
    title: "Zomin Shveytsariyasi va Tog' Ekoturi 2 Kun",
    companyName: "EcoTour Uzbekistan",
    companyVerified: true,
    regionId: "jizzakh",
    route: "Toshkent — Jizzax — Zomin — Toshkent",
    duration: "2 kun / 1 kecha",
    price: "850 000 so'm",
    priceNum: 850000,
    rating: 4.88,
    reviewsCount: 65,
    included: ["Konfortli mikroavtobus", "Kottejda tunash", "3 mahal milliy ovqat", "Shisha ko'prikka kirish", "Tog' trekking yo'lboshchisi"],
    image: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80",
    description: "Archazor tog'lar qo'ynida dam olish, shifobaxsh buloqlar, sharsharalar va shisha ko'prik bo'ylab sarguzasht."
  },
  {
    id: 403,
    title: "Orol Dengizi va Mo'ynoq Ekspeditsiyasi 3 Kun",
    companyName: "Aral Discovery",
    companyVerified: true,
    regionId: "karakalpakstan",
    route: "Nukus — Mo'ynoq — Orol bo'yi kemping — Savitskiy muzeyi",
    duration: "3 kun / 2 kecha",
    price: "3 200 000 so'm",
    priceNum: 3200000,
    rating: 5.0,
    reviewsCount: 42,
    included: ["Toyota Land Cruiser 4x4 safarisi", "Orol bo'yida o'tov (yurt) tunashi", "Usta oshpaz taomlari", "Savitskiy muzeyi chiptasi"],
    image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80",
    description: "Keng Ustyurt platosi, kanyonlar, Orol dengizi suvlari va yulduzli tunlar ostida o'tovda unutilmas taassurotlar."
  },
  {
    id: 404,
    title: "Xorazmning 50 Qal'asi va Xiva Mo''jizalari",
    companyName: "Khiva Travel Heritage",
    companyVerified: true,
    regionId: "khorezm",
    route: "Urganch — Toproqqal'a — Ayozqal'a — Ichan Qala",
    duration: "3 kun / 2 kecha",
    price: "1 950 000 so'm",
    priceNum: 1950000,
    rating: 4.92,
    reviewsCount: 54,
    included: ["Qadimiy qal'alar safarisi", "Ichan Qala ichidagi mehmonxona", "Xorazm milliy konsert kechasi", "Gid xizmati"],
    image: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80",
    description: "Qizilqum sahrosidagi 2000 yillik qadimiy qal'alar va Xiva xonligining jozibador ko'chalari."
  }
];

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
    totalSeats: 180,
    availableSeats: 22,
    price: "175 000 so'm",
    classes: [
      { name: 'Ekonom', price: "175 000 so'm", available: 14 },
      { name: 'Biznes', price: "260 000 so'm", available: 6 },
      { name: 'VIP', price: "380 000 so'm", available: 2 }
    ]
  },
  {
    id: 't-2',
    trainNumber: '764Ф "Afrosiyob"',
    operator: "O'zbekiston Temir Yo'llari",
    trainType: 'Tezyurar poyezd',
    from: 'Toshkent Markaziy',
    to: 'Buxoro 1',
    departureDate: '2026-10-15',
    departure: '2026-10-15 08:30',
    arrival: '2026-10-15 12:20',
    duration: '3s 50d',
    totalSeats: 180,
    availableSeats: 14,
    price: "240 000 so'm",
    classes: [
      { name: 'Ekonom', price: "240 000 so'm", available: 9 },
      { name: 'Biznes', price: "340 000 so'm", available: 4 },
      { name: 'VIP', price: "490 000 so'm", available: 1 }
    ]
  },
  {
    id: 't-3',
    trainNumber: '126Ф "Xiva Ekspress"',
    operator: "O'zbekiston Temir Yo'llari",
    trainType: 'Tezyurar yo\'lovchi',
    from: 'Toshkent Janubiy',
    to: 'Xiva',
    departureDate: '2026-10-15',
    departure: '2026-10-15 20:45',
    arrival: '2026-10-16 09:30',
    duration: '12s 45d',
    totalSeats: 240,
    availableSeats: 54,
    price: "190 000 so'm",
    classes: [
      { name: 'Platskart', price: "190 000 so'm", available: 32 },
      { name: 'Kupe', price: "295 000 so'm", available: 18 },
      { name: 'SV Lyuks', price: "520 000 so'm", available: 4 }
    ]
  }
];

// Aviabiletlar (Flight routes)
export const FLIGHT_ROUTES = [
  {
    id: 'f-1',
    airline: 'Uzbekistan Airways',
    operator: 'Uzbekistan Airways',
    flightNo: 'HY-051',
    from: 'Toshkent (TAS)',
    to: 'Urganch / Xiva (UGC)',
    departureDate: '2026-10-15',
    departure: '2026-10-15 07:15',
    arrival: '2026-10-15 08:45',
    duration: '1s 30d',
    price: "460 000 so'm",
    totalSeats: 150,
    availableSeats: 28,
    baggage: '23 kg + 8 kg qo\'l yuki'
  },
  {
    id: 'f-2',
    airline: 'Silk Avia',
    operator: 'Silk Avia',
    flightNo: 'US-205',
    from: 'Toshkent (TAS)',
    to: 'Samarqand (SKD)',
    departureDate: '2026-10-15',
    departure: '2026-10-15 14:20',
    arrival: '2026-10-15 15:10',
    duration: '0s 50d',
    price: "280 000 so'm",
    totalSeats: 72,
    availableSeats: 16,
    baggage: '20 kg + 5 kg qo\'l yuki'
  },
  {
    id: 'f-3',
    airline: 'Uzbekistan Airways',
    operator: 'Uzbekistan Airways',
    flightNo: 'HY-071',
    from: 'Toshkent (TAS)',
    to: 'Nukus (NCU)',
    departureDate: '2026-10-15',
    departure: '2026-10-15 18:30',
    arrival: '2026-10-15 20:10',
    duration: '1s 40d',
    price: "520 000 so'm",
    totalSeats: 150,
    availableSeats: 35,
    baggage: '23 kg + 8 kg qo\'l yuki'
  },
  {
    id: 'f-4',
    airline: 'Uzbekistan Airways',
    operator: 'Uzbekistan Airways',
    flightNo: 'HY-273',
    from: 'Toshkent (TAS)',
    to: 'Istanbul (IST)',
    departureDate: '2026-10-15',
    departure: '2026-10-15 10:00',
    arrival: '2026-10-15 13:20',
    duration: '5s 20d',
    price: "2 950 000 so'm",
    totalSeats: 220,
    availableSeats: 12,
    baggage: '32 kg + 8 kg qo\'l yuki'
  }
];

// Express Avtobus Chiptalari (Express Buses)
export const BUS_ROUTES = [
  {
    id: 'b-1',
    operator: 'Yutong Comfort Express',
    from: 'Toshkent (Toshkent avtovokzali)',
    to: 'Samarqand',
    departureDate: '2026-10-15',
    departure: '2026-10-15 09:00',
    arrival: '2026-10-15 13:00',
    duration: '4s 00d',
    price: "65 000 so'm",
    totalSeats: 48,
    availableSeats: 18,
    features: ['Wi-Fi', 'Konditsioner', 'USB zaryadlash', 'Choy/Qahva']
  },
  {
    id: 'b-2',
    operator: 'Man Star VIP Bus',
    from: 'Toshkent',
    to: 'Farg\'ona (Vodiy yo\'li)',
    departureDate: '2026-10-15',
    departure: '2026-10-15 07:30',
    arrival: '2026-10-15 12:00',
    duration: '4s 30d',
    price: "75 000 so'm",
    totalSeats: 40,
    availableSeats: 12,
    features: ['Qamchiq dovoni manzarasi', 'Konditsioner', 'Yumshoq o\'rindiq']
  },
  {
    id: 'b-3',
    operator: 'Zomin Eco Shuttle',
    from: 'Toshkent',
    to: 'Zomin Sanatoriysi',
    departureDate: '2026-10-15',
    departure: '2026-10-15 08:00',
    arrival: '2026-10-15 11:45',
    duration: '3s 45d',
    price: "70 000 so'm",
    totalSeats: 32,
    availableSeats: 8,
    features: ['To\'g\'ridan-to\'g\'ri dacha va sanatoriyga eltish', 'Bagaj joyi']
  }
];

// Ovqat yetkazib berish (Food ordering)
export const FOOD_MENU = [
  {
    id: 'food-1',
    name: "Toshkent To'y Oshi (1 kg tovoq)",
    category: "Osh & Palov",
    price: "110 000 so'm",
    priceNum: 110000,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
    restaurant: "Chorsu An'anaviy Osh Markazi",
    prepTime: "25-35 daqiqa"
  },
  {
    id: 'food-2',
    name: "Tandirda pishgan go'shtli somsa (5 dona)",
    category: "Somsa",
    price: "60 000 so'm",
    priceNum: 60000,
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80",
    restaurant: "Chorsu An'anaviy Osh Markazi",
    prepTime: "20 daqiqa"
  },
  {
    id: 'food-3',
    name: "G'ijduvon qiyma shashlik (6 six)",
    category: "Shashlik",
    price: "120 000 so'm",
    priceNum: 120000,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
    restaurant: "Buxoro Ziyofat Oshxonasi",
    prepTime: "30 daqiqa"
  },
  {
    id: 'food-4',
    name: "Uyg'ur qovurma lag'moni",
    category: "Lag'mon",
    price: "48 000 so'm",
    priceNum: 48000,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80",
    restaurant: "Chust Choyxonasi",
    prepTime: "20 daqiqa"
  }
];

// Attraksion chiptalari (Attraction tickets)
export const ATTRACTIONS_DATA = [
  {
    id: 'att-1',
    title: "Amirsoy Kanat Yo'li Chiptasi (Go-pass)",
    location: "Toshkent viloyati, Amirsoy kurorti",
    price: "130 000 so'm",
    priceNum: 130000,
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    description: "Amirsoyning 2290 metr balandlikdagi cho'qqisiga olib chiqadigan zamonaviy yopiq gondola kabinasi."
  },
  {
    id: 'att-2',
    title: "Magic City Toshkent All-Access Pass",
    location: "Toshkent shahri, Bobur bog'i",
    price: "90 000 so'm",
    priceNum: 90000,
    image: "https://images.unsplash.com/photo-1578926375605-eaf7559b1458?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    description: "Orol Akvarium, musiqiy favvora shousi, attraksionlar va ertaknamo qal'a xiyoboni."
  },
  {
    id: 'att-3',
    title: "Boqiy Shahar (Eternal City) Samarkand",
    location: "Samarqand, Silk Road majmuasi",
    price: "50 000 so'm",
    priceNum: 50000,
    image: "https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=600&q=80",
    rating: 4.95,
    description: "Sharqona me'morchilik san'ati, hunarmandchilik do'konlari, amfiteatr va qayiq sayrlari."
  }
];

// Boshlang'ich Ariza ma'lumotlari (Admin panelida tekshirish uchun tayyor mock arizalar)
export const INITIAL_VERIFICATIONS = [
  {
    id: 1,
    serviceType: "tour_company",
    serviceTypeName: "Tour Kompaniya",
    companyName: "Silk Road Voyages LLC",
    contactPerson: "Alisher Vohidov",
    phone: "+998 90 321 00 11",
    email: "silkroad.travel@uz",
    viloyat: "Samarqand",
    tuman: "Samarqand shahri",
    licenseNumber: "TR-UZ-2024-884",
    status: "pending", // 'pending' | 'approved' | 'rejected'
    submittedAt: "2026-09-26 14:30",
    notes: "Kompaniyamiz 5 yildan beri ichki va tashqi turizm bilan shug'ullanadi. Tourly platformasida rasmiy hamkor bo'lmoqchimiz.",
    galleryImages: [
      "https://images.unsplash.com/photo-1596484552824-26615b135c3c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
    ],
    passportFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    passportBack: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    serviceType: "hotel",
    serviceTypeName: "Mehmonxona",
    companyName: "Zomin Archazor Resort",
    contactPerson: "Sanjar Qodirov",
    phone: "+998 99 777 44 22",
    email: "zomin.resort@mail.uz",
    viloyat: "Jizzax",
    tuman: "Zomin",
    stars: 4,
    status: "approved",
    submittedAt: "2026-09-25 18:10",
    notes: "Zomin tog'larida 24 ta oilaviy va lyuks xonalarimiz mavjud.",
    galleryImages: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    ],
    passportFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    passportBack: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    serviceType: "guide",
    serviceTypeName: "Gid Yo'lboshchi",
    companyName: "Aziza Xolmurodova",
    contactPerson: "Aziza Xolmurodova",
    phone: "+998 93 111 22 33",
    email: "aziza.guide@gmail.com",
    viloyat: "Buxoro",
    tuman: "Buxoro shahri",
    languages: "O'zbek, Rus, Ingliz, Fransuz",
    experienceYears: 6,
    status: "pending",
    submittedAt: "2026-09-26 10:15",
    notes: "Buxoro va Samarqand bo'yicha litsenziyaga ega professional gidman.",
    galleryImages: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    ],
    passportFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    passportBack: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 4,
    serviceType: "taxi",
    serviceTypeName: "Taksi Haydovchisi",
    companyName: "Mansur Karimov",
    contactPerson: "Mansur Karimov",
    phone: "+998 90 999 12 34",
    email: "mansur.driver@mail.ru",
    viloyat: "Toshkent viloyati",
    tuman: "Bo'stonliq",
    carModel: "Chevrolet Traverse (Oq rang, 2023)",
    licensePlate: "01 A 777 AA",
    status: "pending",
    submittedAt: "2026-09-26 16:45",
    notes: "Chorvoq, Chimgan va Amirsoyga doimiy sayyohlarni qulay olib borib kelaman. 7 kishilik qulay salon.",
    galleryImages: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
    ],
    passportFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    passportBack: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 5,
    serviceType: "restoran",
    serviceTypeName: "Restoran / Oshxona",
    companyName: "Karmana Milliy Oshxonasi",
    contactPerson: "Jasur Rahimov",
    phone: "+998 91 333 77 11",
    email: "jasur.navoiy@gmail.com",
    viloyat: "Navoiy",
    tuman: "Karmana",
    cuisineType: "Milliy va Tandir",
    status: "pending",
    submittedAt: "2026-09-27 12:15",
    notes: "Navoiy viloyatida eng mashhur tandir palov va jiz tayyorlaymiz. Sayyohlar uchun 150 kishilik zal.",
    details: {
      companyName: "Karmana Milliy Oshxonasi",
      cuisineType: "Milliy va Tandir",
      dailyPrice: "70 000 so'm / kishi",
      address: "Navoiy viloyati, Karmana tumani, Navoiy shoh ko'chasi 12",
      latitude: "40.138",
      longitude: "65.362"
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
    ],
    passportFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    passportBack: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 6,
    serviceType: "home_rent",
    serviceTypeName: "Uy va Dacha Ijarasi",
    companyName: "Aydarko'l Panorama Dacha",
    contactPerson: "Shuxrat Omonov",
    phone: "+998 90 444 11 22",
    email: "shuxrat.dacha@mail.ru",
    viloyat: "Navoiy",
    tuman: "Nurota",
    status: "pending",
    submittedAt: "2026-09-27 15:40",
    notes: "Aydarko'l sohilida joylashgan, hovuz va saunaga ega 10 kishilik qulay dacha.",
    details: {
      companyName: "Aydarko'l Panorama Dacha",
      roomsCount: 4,
      dailyPrice: "1 500 000 so'm / kun",
      priceNum: 1500000,
      address: "Navoiy viloyati, Nurota tumani, Aydarko'l sohili",
      latitude: "40.562",
      longitude: "65.688"
    },
    galleryImages: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    passportFront: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    passportBack: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80"
  }
];

export const TAXIS_DATA = [
  {
    id: 501,
    serviceType: "taxi",
    type: "taxi",
    title: "Komiljon Rahimov — Chevrolet Cobalt",
    hostName: "Komiljon Rahimov",
    driverName: "Komiljon Rahimov",
    carModel: "Chevrolet Cobalt (2023)",
    licensePlate: "01 777 AAA",
    phone: "+998 90 123 45 67",
    viloyat: "Toshkent shahri",
    tuman: "Yakkasaroy",
    regionId: "tashkent-city",
    regionName: "Toshkent shahri, Yakkasaroy",
    price: "150 000 so'm / qatnov",
    rating: 4.9,
    tripsCount: 142,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
    ],
    description: "Toshkent aeroporti, vokzal va Chorvoq-Chimgan tog'li hududlariga xavfsiz va qulay transport. Salonda konditsioner, Wi-Fi va toza muhit.",
  },
  {
    id: 502,
    serviceType: "taxi",
    type: "taxi",
    title: "Javohir To'xtayev — Chevrolet Traverse",
    hostName: "Javohir To'xtayev",
    driverName: "Javohir To'xtayev",
    carModel: "Chevrolet Traverse 7 o'rinli (2024)",
    licensePlate: "10 555 BBB",
    phone: "+998 93 987 65 43",
    viloyat: "Toshkent viloyati",
    tuman: "Bo'stonliq",
    regionId: "tashkent-region",
    regionName: "Toshkent viloyati, Bo'stonliq",
    price: "350 000 so'm / kun",
    rating: 5.0,
    tripsCount: 98,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    ],
    description: "Amirsoy, Chimgan va Chorvoq dam olish maskanlariga oilaviy va sayyohlar guruhi uchun 7 kishilik qulay VIP transport.",
  },
  {
    id: 503,
    serviceType: "taxi",
    type: "taxi",
    title: "Alisher Zokirov — Chevrolet Gentra",
    hostName: "Alisher Zokirov",
    driverName: "Alisher Zokirov",
    carModel: "Chevrolet Gentra Elegant (2023)",
    licensePlate: "30 333 CCC",
    phone: "+998 97 345 67 89",
    viloyat: "Samarqand",
    tuman: "Samarqand shahri",
    regionId: "samarkand",
    regionName: "Samarqand, Registon",
    price: "120 000 so'm / soat",
    rating: 4.95,
    tripsCount: 215,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    ],
    description: "Samarqandning barcha tarixiy obidalari bo'ylab sayyohlarga qulay va tezkor taksi xizmati. Mehmonxonadan kutib olish bepul.",
  }
];

// Professional Gidlar (Professional Guides)
export const GUIDES_DATA = [
  {
    id: 401,
    category: 'guide',
    type: 'guide',
    title: "Aziza Xolmurodova — Tarixchi Gid",
    name: "Aziza Xolmurodova",
    hostName: "Aziza Xolmurodova",
    phone: "+998 93 111 22 33",
    viloyat: "Buxoro",
    tuman: "Buxoro shahri",
    regionId: "bukhara",
    regionName: "Buxoro, Buxoro shahri",
    price: "250 000 so'm / kun",
    rating: 5.0,
    reviewsCount: 42,
    languages: ["O'zbek", "Rus", "Ingliz", "Fransuz"],
    experienceYears: 6,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Buxoro va Samarqand qadimiy obidalari bo'yicha 6 yillik tajribaga ega litsenziyali gid. Ekskursiyalar 4 tilda olib boriladi.",
    lat: 39.7747,
    lng: 64.4286,
  },
  {
    id: 402,
    category: 'guide',
    type: 'guide',
    title: "Farrux Qodirov — Registon & Boqiy Shahar",
    name: "Farrux Qodirov",
    hostName: "Farrux Qodirov",
    phone: "+998 97 888 77 66",
    viloyat: "Samarqand",
    tuman: "Samarqand shahri",
    regionId: "samarkand",
    regionName: "Samarqand, Registon",
    price: "300 000 so'm / kun",
    rating: 4.9,
    reviewsCount: 56,
    languages: ["O'zbek", "Ingliz", "Nemis"],
    experienceYears: 8,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Samarqand madaniy merosi, Amir Temur tarixi va Sharq gavhari bo'ylab chuqur va maroqli ekskursiyalar.",
    lat: 39.6542,
    lng: 66.9597,
  },
  {
    id: 403,
    category: 'guide',
    type: 'guide',
    title: "Jamshid Norov — Ichan Qala & Qadimgi Xorazm",
    name: "Jamshid Norov",
    hostName: "Jamshid Norov",
    phone: "+998 91 999 44 55",
    viloyat: "Xorazm",
    tuman: "Xiva",
    regionId: "khorezm",
    regionName: "Xorazm, Xiva (Ichan Qala)",
    price: "220 000 so'm / kun",
    rating: 4.95,
    reviewsCount: 39,
    languages: ["O'zbek", "Rus", "Turk"],
    experienceYears: 5,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80"
    ],
    description: "Xiva Ichan Qala ochiq osmon ostidagi muzey shahri bo'ylab unutilmas sayohat. Xonlar tarixi va me'morchiligi.",
    lat: 41.3783,
    lng: 60.3639,
  }
];

