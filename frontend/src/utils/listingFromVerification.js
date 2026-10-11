import { REGIONS_DATA } from '../data/mockData';

export const VILOYAT_TO_REGION_ID = {
  "Toshkent shahri": 'tashkent-city',
  "Toshkent viloyati": 'tashkent-region',
  Samarqand: 'samarkand',
  Buxoro: 'bukhara',
  Xorazm: 'khorezm',
  Andijon: 'andijan',
  "Farg'ona": 'fergana',
  Namangan: 'namangan',
  Qashqadaryo: 'qashqadaryo',
  Surxondaryo: 'surxondaryo',
  Jizzax: 'jizzakh',
  Sirdaryo: 'sirdaryo',
  Navoiy: 'navoiy',
  "Qoraqalpog'iston": 'karakalpakstan',
};

export const REGION_ID_TO_VILOYAT = {
  'tashkent-city': "Toshkent shahri",
  'tashkent-region': "Toshkent viloyati",
  'samarkand': "Samarqand",
  'bukhara': "Buxoro",
  'khorezm': "Xorazm",
  'andijan': "Andijon",
  'fergana': "Farg'ona",
  'namangan': "Namangan",
  'qashqadaryo': "Qashqadaryo",
  'surxondaryo': "Surxondaryo",
  'jizzakh': "Jizzax",
  'sirdaryo': "Sirdaryo",
  'navoiy': "Navoiy",
  'karakalpakstan': "Qoraqalpog'iston",
};

export function regionIdFromViloyat(viloyat) {
  if (!viloyat) return 'tashkent-city';
  if (VILOYAT_TO_REGION_ID[viloyat]) return VILOYAT_TO_REGION_ID[viloyat];
  const s = viloyat.toLowerCase().trim();
  for (const [v, rId] of Object.entries(VILOYAT_TO_REGION_ID)) {
    if (v.toLowerCase() === s || rId.toLowerCase() === s) return rId;
  }
  if (s.includes('navoiy') || s.includes('navoi')) return 'navoiy';
  if (s.includes('samarqand') || s.includes('samarkand')) return 'samarkand';
  if (s.includes('buxoro') || s.includes('bukhara')) return 'bukhara';
  if (s.includes('xorazm') || s.includes('xiva') || s.includes('khiva')) return 'khorezm';
  if (s.includes('toshkent shah') || s.includes('tashkent city')) return 'tashkent-city';
  if (s.includes('toshkent vil') || s.includes('tashkent reg')) return 'tashkent-region';
  if (s.includes('jizzax') || s.includes('zomin')) return 'jizzakh';
  if (s.includes('qashqadaryo') || s.includes('shahrisabz')) return 'qashqadaryo';
  if (s.includes('surxondaryo') || s.includes('termiz')) return 'surxondaryo';
  if (s.includes('andijon')) return 'andijan';
  if (s.includes("farg'ona") || s.includes('fergana')) return 'fergana';
  if (s.includes('namangan')) return 'namangan';
  if (s.includes('sirdaryo')) return 'sirdaryo';
  if (s.includes('qoraqalpog') || s.includes('nukus')) return 'karakalpakstan';
  return 'tashkent-city';
}

export function regionNameFromId(regionId) {
  const r = REGIONS_DATA.find((x) => x.id === regionId);
  return r?.name || REGION_ID_TO_VILOYAT[regionId] || "O'zbekiston";
}

export function buildListingFromVerification(verification, overrides = {}) {
  const d = verification.details || {};
  const viloyat = overrides.viloyat || verification.viloyat || 'Toshkent shahri';
  const tuman = overrides.tuman || verification.tuman || '';
  const regionId = regionIdFromViloyat(viloyat);
  const regionLabel = tuman ? `${viloyat}, ${tuman}` : viloyat;
  
  const img =
    overrides.image ||
    overrides.images?.[0] ||
    verification.galleryImages?.[0] ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  
  const images = overrides.images?.length
    ? overrides.images
    : verification.galleryImages?.length
    ? verification.galleryImages
    : [img];

  const hostName =
    overrides.hostName ||
    overrides.contactPerson ||
    verification.contactPerson ||
    [d.firstName, d.lastName].filter(Boolean).join(' ') ||
    'Tourly hamkor';

  const hostPhone = overrides.phone || verification.phone || '+998 90 123 45 67';
  const description = overrides.description || overrides.adminDescription || verification.adminDescription || verification.notes || '';
  const price = overrides.price || d.dailyPrice || "Kelishilgan narx";
  const title = overrides.title || overrides.name || verification.companyName || d.companyName || `${hostName}`;

  const base = {
    id: verification.id || Date.now(),
    viloyat,
    tuman,
    regionId,
    regionName: regionLabel,
    hostName,
    phone: hostPhone,
    hostPhone,
    hostAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    lat: parseFloat(overrides.lat || d.latitude) || 41.31,
    lng: parseFloat(overrides.lng || d.longitude) || 69.24,
    description,
    adminDescription: description,
    image: img,
    images,
    rating: overrides.rating || 5.0,
    reviewsCount: overrides.reviewsCount || 0,
    price,
  };

  const serviceType = overrides.serviceType || overrides.category || verification.serviceType;

  switch (serviceType) {
    case 'home_rent':
    case 'cottage':
      return {
        type: 'cottage',
        item: {
          ...base,
          category: 'cottage',
          title: title || `${hostName} dachasi`,
          price,
          priceNum: overrides.priceNum || d.priceNum || 0,
          rating: overrides.rating || 5,
          reviewsCount: overrides.reviewsCount || 0,
          bedrooms: Number(overrides.bedrooms || d.roomsCount) || 2,
          bathrooms: Number(overrides.bathrooms || d.bathrooms) || 2,
          capacity: overrides.capacity || d.capacity || "10 kishilik",
          hasPool: overrides.hasPool ?? d.hasPool ?? true,
          hasSauna: overrides.hasSauna ?? d.hasSauna ?? true,
          images,
          description,
        },
      };
    case 'hotel':
      return {
        type: 'hotel',
        item: {
          ...base,
          category: 'hotel',
          name: title || 'Mehmonxona',
          title: title || 'Mehmonxona',
          address: overrides.address || d.address || regionLabel,
          stars: Number(overrides.stars || d.stars) || 3,
          price,
          pricePerNight: price,
          rating: overrides.rating || 5,
          reviewsCount: overrides.reviewsCount || 0,
          image: img,
          images,
          description,
        },
      };
    case 'restoran':
    case 'restaurant':
      return {
        type: 'restaurant',
        item: {
          ...base,
          category: 'restaurant',
          name: title || 'Restoran',
          title: title || 'Restoran',
          cuisine: overrides.cuisine || d.cuisineType || 'Milliy',
          address: overrides.address || d.address || regionLabel,
          rating: overrides.rating || 5,
          reviewsCount: overrides.reviewsCount || 0,
          image: img,
          images,
          description,
        },
      };
    case 'taxi':
      return {
        type: 'taxi',
        item: {
          ...base,
          category: 'taxi',
          title: title || `${hostName} (${overrides.carModel || d.carModel || 'Taksi'})`,
          driverName: hostName,
          carModel: overrides.carModel || d.carModel || 'Taksi',
          licensePlate: overrides.licensePlate || d.licensePlate || 'Davlat raqami',
          price,
          rating: overrides.rating || 5,
          reviewsCount: overrides.reviewsCount || 0,
          image: img,
          images,
          description,
        },
      };
    case 'guide':
      return {
        type: 'guide',
        item: {
          ...base,
          category: 'guide',
          name: hostName,
          title: title || `${hostName} — Gid Yo'lboshchi`,
          languages: overrides.languages || d.selectedLanguages || ["O'zbek", "Rus"],
          experienceYears: overrides.experienceYears || d.experienceYears || 5,
          price,
          rating: overrides.rating || 5,
          reviewsCount: overrides.reviewsCount || 0,
          image: img,
          images,
          description,
        },
      };
    case 'tour_company':
      return { type: 'tour_company_approval', item: verification };
    default:
      return null;
  }
}

