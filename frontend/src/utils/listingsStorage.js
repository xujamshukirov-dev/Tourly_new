import { regionIdFromViloyat } from './listingFromVerification.js';

const STORAGE_KEY = 'tourly_all_listings';
const LEGACY_APPROVED_KEY = 'tourly_approved_listings';

export function normalizeCategory(cat) {
  if (!cat) return 'cottages';
  const c = cat.toLowerCase();
  if (c === 'restoran' || c === 'restaurant' || c === 'restaurants') return 'restaurants';
  if (c === 'taxi' || c === 'taxis') return 'taxis';
  if (c === 'home_rent' || c === 'cottage' || c === 'cottages' || c === 'dacha') return 'cottages';
  if (c === 'hotel' || c === 'hotels') return 'hotels';
  if (c === 'guide' || c === 'guides') return 'guides';
  return 'cottages';
}

export function getCategorySingular(cat) {
  const norm = normalizeCategory(cat);
  if (norm === 'restaurants') return 'restaurant';
  if (norm === 'taxis') return 'taxi';
  if (norm === 'cottages') return 'cottage';
  if (norm === 'hotels') return 'hotel';
  if (norm === 'guides') return 'guide';
  return 'cottage';
}

export function getCategoryLabel(cat) {
  const norm = normalizeCategory(cat);
  switch (norm) {
    case 'restaurants':
      return 'Restoran';
    case 'taxis':
      return 'Taksi';
    case 'cottages':
      return 'Uy va Dacha';
    case 'hotels':
      return 'Mehmonxona';
    case 'guides':
      return 'Gid Yo\'lboshchi';
    default:
      return 'Xizmat';
  }
}

/**
 * Boshlang'ich barcha e'lonlar to'plamini yuklash (localStorage yoki mock)
 */
export function initListingsStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          cottages: Array.isArray(parsed.cottages) ? parsed.cottages : [],
          restaurants: Array.isArray(parsed.restaurants) ? parsed.restaurants : [],
          hotels: Array.isArray(parsed.hotels) ? parsed.hotels : [],
          taxis: Array.isArray(parsed.taxis) ? parsed.taxis : [],
          guides: Array.isArray(parsed.guides) ? parsed.guides : [],
        };
      }
    }

    return {
      cottages: [],
      restaurants: [],
      hotels: [],
      taxis: [],
      guides: [],
    };
  } catch (e) {
    console.error('Error initializing listings store:', e);
    return {
      cottages: [],
      restaurants: [],
      hotels: [],
      taxis: [],
      guides: [],
    };
  }
}

export function loadAllListings() {
  return initListingsStore();
}

export function saveAllListings(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving listings store:', e);
  }
}

/**
 * Yangi e'lon qo'shish
 */
export function addListingToStore(category, item) {
  const store = loadAllListings();
  const listKey = normalizeCategory(category);
  const regionId = item.regionId || regionIdFromViloyat(item.viloyat);
  const updatedItem = {
    ...item,
    id: item.id || Date.now(),
    category: getCategorySingular(listKey),
    regionId,
  };

  store[listKey] = [updatedItem, ...(store[listKey] || []).filter((x) => x.id !== updatedItem.id)];
  saveAllListings(store);
  return store;
}

/**
 * Mavjud e'lonni tahrirlash (kategoriya o'zgargan bo'lsa ko'chirish)
 */
export function updateListingInStore(category, item, oldCategory = null) {
  const store = loadAllListings();
  const targetKey = normalizeCategory(category);
  const oldKey = oldCategory ? normalizeCategory(oldCategory) : targetKey;

  const regionId = item.regionId || regionIdFromViloyat(item.viloyat);
  const updatedItem = {
    ...item,
    category: getCategorySingular(targetKey),
    regionId,
  };

  if (oldKey !== targetKey && store[oldKey]) {
    store[oldKey] = store[oldKey].filter((x) => x.id !== item.id);
  }

  const list = store[targetKey] || [];
  const index = list.findIndex((x) => x.id === item.id);
  if (index >= 0) {
    list[index] = { ...list[index], ...updatedItem };
    store[targetKey] = [...list];
  } else {
    store[targetKey] = [updatedItem, ...list];
  }

  saveAllListings(store);
  return store;
}

/**
 * E'lonni saytdan butunlay o'chirish
 */
export function deleteListingFromStore(category, id) {
  const store = loadAllListings();
  const targetKey = category ? normalizeCategory(category) : null;

  if (targetKey && store[targetKey]) {
    store[targetKey] = store[targetKey].filter((x) => x.id !== id);
  } else {
    // Agar kategoriya aniq bo'lmasa barcha ro'yxatlardan tekshirib o'chirish
    Object.keys(store).forEach((k) => {
      if (Array.isArray(store[k])) {
        store[k] = store[k].filter((x) => x.id !== id);
      }
    });
  }

  saveAllListings(store);
  return store;
}

/**
 * Admin "Chop etilgan barcha e'lonlar" ro'yxati uchun yagona yassi array
 */
export function getAllPublishedFlat(store) {
  if (!store) return [];
  const result = [];

  const categories = [
    { key: 'restaurants', singular: 'restaurant', label: 'Restoran' },
    { key: 'taxis', singular: 'taxi', label: 'Taksi' },
    { key: 'cottages', singular: 'cottage', label: 'Uy va Dacha' },
    { key: 'hotels', singular: 'hotel', label: 'Mehmonxona' },
    { key: 'guides', singular: 'guide', label: 'Gid Yo\'lboshchi' },
  ];

  categories.forEach(({ key, singular, label }) => {
    const list = store[key] || [];
    list.forEach((item) => {
      result.push({
        ...item,
        categoryKey: key,
        categorySingular: singular,
        categoryLabel: label,
        displayName: item.title || item.name || item.companyName || 'Nomsiz e\'lon',
        displayPrice: item.price || item.pricePerNight || 'Kelishilgan',
        displayLocation: item.regionName || (item.viloyat ? `${item.viloyat}${item.tuman ? `, ${item.tuman}` : ''}` : 'O\'zbekiston'),
        displayImage: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      });
    });
  });

  return result;
}

// Backward compatibility exports
export function loadApprovedListings() {
  return initListingsStore();
}

export function saveApprovedListing(type, item) {
  addListingToStore(type, item);
}

export function mergeWithMock(mockItems, approvedItems) {
  const ids = new Set(approvedItems.map((x) => x.id));
  return [...approvedItems, ...mockItems.filter((x) => !ids.has(x.id))];
}
