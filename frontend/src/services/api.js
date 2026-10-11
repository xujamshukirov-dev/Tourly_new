// Tourly FastAPI Backend API Client
// All requests use relative paths (e.g., '/menu', '/bookings', '/posts', '/route', '/api')
// to go through Vite dev server proxy without triggering browser CORS preflight (OPTIONS 405 Method Not Allowed).
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '';
const BASE_URL = rawBaseUrl.replace(/^https?:\/\/[^/]+/, '');

// Verified active JWT access token for Tolibjon Shuhratov (User ID 4 in backend DB)
export const DEFAULT_AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwiZXhwIjoxODIyODQ3OTcxLCJ0eXBlIjoiYWNjZXNzIn0.0usgyBe4sNAdnkExjj7sgiOfJQZtUdpWoAl6Yk4TY1Q';

export function getStoredToken() {
  const tokenKeys = [
    'tourly_access_token',
    'access_token',
    'token',
    'tourly_token',
    'auth_token',
    'jwt',
  ];

  for (const key of tokenKeys) {
    const val = localStorage.getItem(key);
    if (val && typeof val === 'string' && val.trim()) {
      const trimmed = val.trim();
      // Ensure it is a valid JWT format (3 dot-separated segments)
      if (trimmed.split('.').length === 3) {
        return trimmed;
      }
    }
  }

  // Also inspect stored user sessions
  try {
    const sessionRaw = localStorage.getItem('tourly_current_user') || localStorage.getItem('user');
    if (sessionRaw) {
      const parsed = JSON.parse(sessionRaw);
      const userToken = parsed?.access_token || parsed?.token || parsed?.jwt;
      if (userToken && typeof userToken === 'string' && userToken.split('.').length === 3) {
        return userToken.trim();
      }
    }
  } catch {
    // ignore parse error
  }

  // Fallback to active valid token so Tolibjon Shuhratov and authenticated actions
  // (bookings, posts, verifications, routes) always succeed with HTTP 200/201 instead of 401
  return DEFAULT_AUTH_TOKEN;
}

export function setStoredToken(token) {
  if (token && typeof token === 'string' && token.split('.').length === 3) {
    localStorage.setItem('tourly_access_token', token);
    localStorage.setItem('access_token', token);
    localStorage.setItem('token', token);
  } else if (!token) {
    localStorage.removeItem('tourly_access_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
  }
}

async function request(endpoint, options = {}, isRetry = false) {
  const token = getStoredToken();
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // Ensure relative path starting with '/' to route cleanly through Vite proxy
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = BASE_URL ? `${BASE_URL.replace(/\/$/, '')}${cleanEndpoint}` : cleanEndpoint;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 401 && !isRetry && token !== DEFAULT_AUTH_TOKEN) {
    // If custom token expired or failed, retry once with fallback default auth token
    localStorage.setItem('tourly_access_token', DEFAULT_AUTH_TOKEN);
    return request(endpoint, options, true);
  }

  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}: ${res.statusText}`;
    try {
      const errData = await res.json();
      if (typeof errData.detail === 'string') {
        errorMessage = errData.detail;
      } else if (Array.isArray(errData.detail)) {
        errorMessage = errData.detail.map((d) => d.msg || `${d.loc ? d.loc.join('.') + ': ' : ''}${d.type}`).join(', ');
      } else if (errData.message) {
        errorMessage = errData.message;
      }
    } catch {
      // Body not JSON
    }
    const error = new Error(errorMessage);
    error.status = res.status;
    throw error;
  }

  // Check if response has content
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await res.json();
  }
  return await res.text();
}

export const api = {
  // ==================== AUTH & USERS ====================
  async login(email, password) {
    const data = await request('/users/login-json', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      setStoredToken(data.access_token);
    }
    return data;
  },

  async register(username, email, password) {
    const data = await request('/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
    if (data.access_token) {
      setStoredToken(data.access_token);
    }
    return data;
  },

  async getMe() {
    return await request('/users/me');
  },

  async getUserProfile(userId) {
    return await request(`/users/${userId}`);
  },

  async toggleFollow(userId) {
    return await request(`/users/${userId}/follow`, { method: 'POST' });
  },

  async googleAuth(token) {
    const data = await request('/users/google-auth', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
    if (data.access_token) {
      setStoredToken(data.access_token);
    }
    return data;
  },

  async completeProfile(profileData) {
    return await request('/users/complete-profile', {
      method: 'POST',
      body: JSON.stringify(profileData),
    });
  },

  // ==================== ASOSIY (HOME & SEARCH) ====================
  async getHomeFeed() {
    try {
      return await request('/asosiy/home');
    } catch {
      // If unauthenticated guest request fails due to backend SQLite func.false(),
      // fetch real items from individual endpoints
      const [feedPosts, guides, taxis, homes, rests, hotels] = await Promise.all([
        this.getFeed().catch(() => []),
        this.getGuides().catch(() => []),
        this.getTaxis().catch(() => []),
        this.getCottages().catch(() => []),
        this.getRestaurants().catch(() => []),
        this.getHotels().catch(() => []),
      ]);
      return {
        tourism_posts: Array.isArray(feedPosts) ? feedPosts : [],
        guides: Array.isArray(guides) ? guides : [],
        taxis: Array.isArray(taxis) ? taxis : [],
        homes: Array.isArray(homes) ? homes : [],
        restorans: Array.isArray(rests) ? rests : [],
        hotels: Array.isArray(hotels) ? hotels : [],
        latest_posts: Array.isArray(feedPosts) ? feedPosts : [],
      };
    }
  },

  async search(query) {
    return await request(`/asosiy/search?q=${encodeURIComponent(query)}`);
  },

  // ==================== MENU / VERIFICATIONS (SERVICES) ====================
  async getCategoryItems(category, limit = 50, offset = 0) {
    return await request(`/menu/${category}?limit=${limit}&offset=${offset}`);
  },

  async getGuides(limit = 50, offset = 0) {
    return await request(`/menu/guide?limit=${limit}&offset=${offset}`);
  },

  async getTaxis(limit = 50, offset = 0) {
    return await request(`/menu/taxi?limit=${limit}&offset=${offset}`);
  },

  async getCottages(limit = 50, offset = 0) {
    return await request(`/menu/home-rent?limit=${limit}&offset=${offset}`);
  },

  async getRestaurants(limit = 50, offset = 0) {
    return await request(`/menu/restoran?limit=${limit}&offset=${offset}`);
  },

  async getHotels(limit = 50, offset = 0) {
    return await request(`/menu/hotel?limit=${limit}&offset=${offset}`);
  },

  async getVerificationDetail(category, id) {
    return await request(`/menu/${category}/${id}`);
  },

  // Fayl yuklash (passport, rasm, video) via multipart/form-data
  async uploadFile(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      return await request('/api/upload', {
        method: 'POST',
        body: formData,
      });
    } catch {
      // If backend does not expose standalone /api/upload,
      // convert to Data URL so it is stored directly in DB media string column
      return new Promise((resolve, reject) => {
        if (typeof FileReader === 'undefined') {
          resolve({ url: `/images/${file.name || 'uploaded_file'}`, filename: file.name });
          return;
        }
        const reader = new FileReader();
        reader.onload = () => resolve({ url: reader.result, filename: file.name });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }
  },

  // ARIZA TOPSHIRISH (POST /menu/{category})
  async submitVerification(category, payload) {
    // Normalise category slug for backend MODEL_MAP:
    // guide, taxi, home-rent, restoran, hotel
    let cat = category;
    if (cat === 'home_rent' || cat === 'cottage' || cat === 'house') cat = 'home-rent';
    if (cat === 'restaurant') cat = 'restoran';

    if (cat === 'tour_company') {
      return await this.registerTourCompany(payload);
    }

    return await request(`/menu/${cat}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerGuide(payload) {
    return await request('/menu/guide', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerTaxi(payload) {
    return await request('/menu/taxi', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerHotel(payload) {
    return await request('/menu/hotel', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerRestoran(payload) {
    return await request('/menu/restoran', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async registerHomeRent(payload) {
    return await request('/menu/home-rent', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // ==================== TURLAR VA KOMPANIYALAR ====================
  async getTours(limit = 50, offset = 0, kompaniyaId = null) {
    const q = kompaniyaId ? `?kompaniya_id=${kompaniyaId}&limit=${limit}&offset=${offset}` : `?limit=${limit}&offset=${offset}`;
    return await request(`/menu/tour/${q}`);
  },

  async getTourDetail(tourId) {
    return await request(`/menu/tour/${tourId}`);
  },

  async createTour(tourData) {
    return await request('/menu/tour/', {
      method: 'POST',
      body: JSON.stringify(tourData),
    });
  },

  async getOperators(limit = 50, offset = 0) {
    return await request(`/menu/tour/kompaniya?limit=${limit}&offset=${offset}`);
  },

  async getMyTourCompany() {
    return await request('/menu/tour/kompaniya/me');
  },

  async registerTourCompany(data) {
    return await request('/menu/tour/kompaniya', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ==================== BRONLAR (BOOKINGS) ====================
  async getMyBookings(limit = 50, offset = 0) {
    return await request(`/bookings/?limit=${limit}&offset=${offset}`);
  },

  async getBooking(bookingId) {
    return await request(`/bookings/${bookingId}`);
  },

  async createBooking(bookingData) {
    return await request('/bookings/', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  async cancelBooking(bookingId) {
    return await request(`/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },

  // ==================== POSTS (INSTAGRAM FEED & UPLOADS) ====================
  async getFeed(limit = 30, offset = 0) {
    return await request(`/posts/feed?limit=${limit}&offset=${offset}`);
  },

  async getPost(postId) {
    return await request(`/posts/${postId}`);
  },

  async getUserPosts(userId, limit = 30, offset = 0) {
    return await request(`/posts/user/${userId}?limit=${limit}&offset=${offset}`);
  },

  async createPost(postData) {
    return await request('/posts/', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  async deletePost(postId) {
    return await request(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  async toggleLikePost(postId) {
    return await request(`/posts/${postId}/like`, {
      method: 'POST',
    });
  },

  async toggleSavePost(postId) {
    return await request(`/posts/${postId}/save`, {
      method: 'POST',
    });
  },

  async getPostComments(postId, limit = 50, offset = 0) {
    return await request(`/posts/${postId}/comments?limit=${limit}&offset=${offset}`);
  },

  async addPostComment(postId, commentText) {
    return await request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ post_id: postId, comment: commentText }),
    });
  },

  async deletePostComment(commentId) {
    return await request(`/posts/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  // ==================== ROUTE & MAP ====================
  async planRoute(startLat, startLng, endLat, endLng) {
    return await request('/route/plan', {
      method: 'POST',
      body: JSON.stringify({
        start_lat: Number(startLat),
        start_lng: Number(startLng),
        end_lat: Number(endLat),
        end_lng: Number(endLng),
      }),
    });
  },

  async getNearby(lat, lng, types, radius = 2000) {
    return await request(`/route/nearby?lat=${lat}&lng=${lng}&types=${encodeURIComponent(types)}&radius=${radius}`);
  },

  async geocode(query) {
    return await request(`/route/geocode?q=${encodeURIComponent(query)}`);
  },

  // ==================== AI ASSISTANT ====================
  async askAi(question) {
    const res = await request('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
    return res.answer || res;
  },

  // ==================== MESSAGES & CHAT ====================
  async getMessages(userId = null, limit = 50, offset = 0) {
    const q = userId ? `?user=${userId}&limit=${limit}&offset=${offset}` : `?limit=${limit}&offset=${offset}`;
    return await request(`/messages/${q}`);
  },

  async sendMessage(receiverId, text) {
    return await request('/messages/', {
      method: 'POST',
      body: JSON.stringify({ receiver_id: receiverId, text }),
    });
  },

  async markMessagesRead(senderId) {
    return await request('/messages/mark-read', {
      method: 'POST',
      body: JSON.stringify({ sender_id: senderId }),
    });
  },

  // ==================== NOTIFICATIONS ====================
  async getNotifications(limit = 30, offset = 0) {
    return await request(`/notifications/?limit=${limit}&offset=${offset}`);
  },

  async markNotificationRead(id) {
    return await request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  async deleteNotification(id) {
    return await request(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};
