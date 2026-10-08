const USERS_KEY = 'tourly_users';
const SESSION_KEY = 'tourly_current_user';
const ADMIN_SESSION_KEY = 'tourly_admin_session';
const APPROVED_TOUR_COMPANIES_KEY = 'tourly_approved_tour_companies';



function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getRegisteredUsers() {
  return readUsers();
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.id || parsed.username || parsed.name)) return parsed;
    }
  } catch {
    // ignore parse error
  }
  // Default active user session: Tolibjon Shuhratov (User 4 in backend DB)
  return {
    id: 4,
    firstName: 'Tolibjon',
    lastName: 'Shuhratov',
    name: 'Tolibjon Shuhratov',
    username: 'aaa_471',
    email: 'aaa@gmail.com',
    phone: '+998 90 123 45 67',
    bio: 'Tourly sayyohi',
    avatar: null,
    is_verified: false,
    profile_completed: true,
  };
}

export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    const token = user.access_token || user.token;
    if (token && typeof token === 'string' && token.split('.').length === 3) {
      localStorage.setItem('tourly_access_token', token);
      localStorage.setItem('access_token', token);
      localStorage.setItem('token', token);
    }
  } else {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('tourly_access_token');
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
  }
}

export function registerUser({ firstName, lastName, email, password, phone }) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  if (users.some((u) => u.email === normalizedEmail)) {
    throw new Error("Bu email allaqachon ro'yxatdan o'tgan");
  }
  if (password.length < 6) {
    throw new Error('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
  }
  const user = {
    id: Date.now(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password,
    phone: phone.trim(),
    bio: '',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeUsers(users);
  const { password: _, ...publicUser } = user;
  setCurrentUser(publicUser);
  return publicUser;
}

export function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((u) => u.email === normalizedEmail && u.password === password);
  if (!found) {
    throw new Error('Email yoki parol noto\'g\'ri');
  }
  const { password: _, ...publicUser } = found;
  setCurrentUser(publicUser);
  return publicUser;
}

export function logoutUser() {
  setCurrentUser(null);
}

export function updateUserProfile(userId, updates = {}) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId || String(u.id) === String(userId));
  
  let updatedUser = null;
  if (idx >= 0) {
    users[idx] = {
      ...users[idx],
      ...updates,
    };
    writeUsers(users);
    const { password: _, ...publicUser } = users[idx];
    updatedUser = publicUser;
  } else {
    const current = getCurrentUser();
    if (current && (current.id === userId || String(current.id) === String(userId))) {
      updatedUser = {
        ...current,
        ...updates,
      };
    }
  }

  if (updatedUser) {
    setCurrentUser(updatedUser);
  }
  return updatedUser;
}

export function isAdminSessionActive() {
  return false;
}

export function loginAdmin() {
  throw new Error("Admin boshqaruvi xavfsiz backend serveri (/admin) orqali amalga oshiriladi");
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function getApprovedTourCompanies() {
  try {
    return JSON.parse(localStorage.getItem(APPROVED_TOUR_COMPANIES_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addApprovedTourCompany(entry) {
  const list = getApprovedTourCompanies();
  if (!list.some((c) => c.email === entry.email)) {
    list.push(entry);
    localStorage.setItem(APPROVED_TOUR_COMPANIES_KEY, JSON.stringify(list));
  }
}

export function canUserPublishTours(userEmail) {
  if (!userEmail) return false;
  const email = userEmail.toLowerCase();
  return getApprovedTourCompanies().some((c) => c.email?.toLowerCase() === email);
}

export function getUserNotifications(userId) {
  if (!userId) return [];
  try {
    return JSON.parse(localStorage.getItem(`tourly_user_notifications_${userId}`) || '[]');
  } catch {
    return [];
  }
}

export function addUserNotification(userId, { title, message }) {
  if (!userId) return;
  const key = `tourly_user_notifications_${userId}`;
  const existing = getUserNotifications(userId);
  existing.unshift({
    id: Date.now(),
    title,
    message,
    time: 'Hozirgina',
  });
  localStorage.setItem(key, JSON.stringify(existing));
}

export function appendAdminBroadcastNotification(userId, title, message) {
  addUserNotification(userId, { title, message });
}
