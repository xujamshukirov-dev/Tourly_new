// Tourly Reels Storage — IndexedDB & LocalStorage Hybrid Persistence
const STORAGE_KEY = 'tourly_reels';
const DB_NAME = 'TourlyMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'reels_videos';

// Open IndexedDB instance safely
function openMediaDB() {
  return new Promise((resolve) => {
    if (!window.indexedDB) {
      resolve(null);
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => resolve(null);
  });
}

// Store video blob in IndexedDB
export async function storeVideoBlob(reelId, blob) {
  try {
    const db = await openMediaDB();
    if (!db) return false;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ id: reelId, blob });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    });
  } catch (e) {
    console.warn('Could not store video blob in IndexedDB', e);
    return false;
  }
}

// Retrieve video blob from IndexedDB and create an Object URL
export async function getVideoBlobUrl(reelId) {
  try {
    const db = await openMediaDB();
    if (!db) return null;
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(reelId);
      req.onsuccess = () => {
        if (req.result?.blob) {
          const url = URL.createObjectURL(req.result.blob);
          resolve(url);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch (e) {
    console.warn('Could not retrieve video blob from IndexedDB', e);
    return null;
  }
}

// Delete video blob from IndexedDB
export async function removeVideoBlob(reelId) {
  try {
    const db = await openMediaDB();
    if (!db) return;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(reelId);
  } catch (e) {
    console.warn('Could not delete video blob', e);
  }
}

/**
 * Boshlang'ich holat: Reels lentasi bo'sh bo'ladi!
 */
export function getStoredReels() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading tourly_reels:', e);
    return [];
  }
}

export function saveStoredReels(reels) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
  } catch (e) {
    console.error('Error saving tourly_reels:', e);
  }
}

/**
 * Yangi Reels qo'shish
 */
export async function createReel({
  videoUrl = '',
  videoFile = null,
  caption = '',
  location = "O'zbekiston",
  regionId = 'all',
  user,
}) {
  const newId = Date.now();
  let resolvedUrl = videoUrl;

  // Agar foydalanuvchi fayl yuklagan bo'lsa, uni IndexedDB ga joylaymiz
  if (videoFile) {
    await storeVideoBlob(newId, videoFile);
    resolvedUrl = URL.createObjectURL(videoFile);
  }

  const authorName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Sayyoh'
    : 'Mehmon Sayyoh';

  const newReel = {
    id: newId,
    videoUrl: resolvedUrl,
    hasBlob: Boolean(videoFile),
    caption: caption.trim(),
    location: location.trim() || "O'zbekiston",
    regionId: regionId || 'all',
    author: authorName,
    authorId: user?.id || 'guest',
    authorEmail: user?.email || '',
    likes: 0,
    likedUserIds: [],
    comments: [],
    createdAt: new Date().toISOString(),
  };

  const currentReels = getStoredReels();
  const updatedReels = [newReel, ...currentReels];
  saveStoredReels(updatedReels);
  return newReel;
}

/**
 * Reelsni o'chirish
 */
export async function deleteReelById(reelId) {
  const current = getStoredReels();
  const target = current.find((r) => r.id === reelId);
  if (target?.hasBlob) {
    await removeVideoBlob(reelId);
  }
  const filtered = current.filter((r) => r.id !== reelId);
  saveStoredReels(filtered);
  return filtered;
}

/**
 * Reels tavsifi yoki ma'lumotlarini tahrirlash
 */
export function updateReelById(reelId, { caption, location }) {
  const current = getStoredReels();
  const index = current.findIndex((r) => r.id === reelId);
  if (index >= 0) {
    current[index] = {
      ...current[index],
      ...(caption !== undefined && { caption: caption.trim() }),
      ...(location !== undefined && { location: location.trim() }),
    };
    saveStoredReels(current);
    return current[index];
  }
  return null;
}

/**
 * Layk bosish yoki bekor qilish
 */
export function toggleReelLike(reelId, userId) {
  const current = getStoredReels();
  const index = current.findIndex((r) => r.id === reelId);
  if (index < 0) return null;

  const reel = current[index];
  const userIdentifier = String(userId || 'anonymous');
  const liked = reel.likedUserIds?.includes(userIdentifier);

  let newLikedUserIds = reel.likedUserIds ? [...reel.likedUserIds] : [];
  let newLikes = Number(reel.likes || 0);

  if (liked) {
    newLikedUserIds = newLikedUserIds.filter((id) => id !== userIdentifier);
    newLikes = Math.max(0, newLikes - 1);
  } else {
    newLikedUserIds.push(userIdentifier);
    newLikes += 1;
  }

  current[index] = {
    ...reel,
    likes: newLikes,
    likedUserIds: newLikedUserIds,
  };

  saveStoredReels(current);
  return current[index];
}

/**
 * Kommentariya qo'shish
 */
export function addReelComment(reelId, { text, user }) {
  if (!text || !text.trim()) return null;

  const current = getStoredReels();
  const index = current.findIndex((r) => r.id === reelId);
  if (index < 0) return null;

  const authorName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Sayyoh'
    : 'Mehmon';

  const newComment = {
    id: Date.now(),
    userId: user?.id || 'guest',
    userName: authorName,
    text: text.trim(),
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const updatedComments = [...(current[index].comments || []), newComment];
  current[index] = {
    ...current[index],
    comments: updatedComments,
  };

  saveStoredReels(current);
  return { updatedReel: current[index], newComment };
}

// Demo namunaviy videolar (foydalanuvchi bitta tugma bilan sinab ko'rishi uchun qulay)
export const DEMO_REELS_PRESETS = [
  {
    title: "Toshkent City va Magic City oqshomi",
    caption: "Toshkent oqshomining jozibali chiroqlari va musiqiy favvoralari! Poytaxt go'zalligi 🏙️✨",
    location: "Toshkent shahri",
    regionId: "tashkent-city",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-city-traffic-at-night-42861-large.mp4",
  },
  {
    title: "Registon Maydoni — Samarqand sirlari",
    caption: "Sharq gavhari Samarqand! Qadimiy Registon madrasalarining muhtasham ko'rinishi 🕌🇺🇿",
    location: "Samarqand, Registon",
    regionId: "samarkand",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-ancient-temple-ruins-surrounded-by-nature-42880-large.mp4",
  },
  {
    title: "Chorvoq suv ombori va tog' havosi",
    caption: "Tog'lar bag'rida musaffo dam olish zavqi! Chorvoq ko'lining zangori suvlari 🌊🏔️",
    location: "Toshkent viloyati, Chorvoq",
    regionId: "tashkent-region",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-valley-with-a-river-42878-large.mp4",
  },
];
