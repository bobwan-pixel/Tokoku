// auth.js - Fixed Login Function
const USERS_KEY = 'tokoku_users_v2';
const ADMIN_KEY = 'tokoku_admin_v2';
const SESSION_KEY = 'tokoku_session_v2';
const SESSION_EXPIRE_DAYS = 7;

function hashPassword(pass) {
  return btoa(encodeURIComponent(pass).split('').reverse().join(''));
}

function createSecureSession(user) {
  const session = {
    id: crypto.randomUUID(),
    userId: user.email,
    token: crypto.getRandomValues(new Uint32Array(1))[0].toString(36),
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_EXPIRE_DAYS * 86400000).toISOString()
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    id: session.id,
    lastActive: new Date().toISOString()
  }));

  sessionStorage.setItem(`session_${session.id}`, JSON.stringify(session));
  return session;
}

function validateSession() {
  try {
    const sessionRef = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!sessionRef) return null;

    const session = JSON.parse(sessionStorage.getItem(`session_${sessionRef.id}`));
    if (!session || new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
}

function clearSession() {
  const sessionRef = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (sessionRef) {
    sessionStorage.removeItem(`session_${sessionRef.id}`);
  }
  localStorage.removeItem(SESSION_KEY);
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_ATTEMPT_KEY = 'login_attempts';

function login(email, password) {
  const attempts = parseInt(localStorage.getItem(LOGIN_ATTEMPT_KEY)) || 0;

  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    const lastAttempt = localStorage.getItem('last_attempt');
    const cooldown = Math.min(30 * (attempts - MAX_LOGIN_ATTEMPTS + 1), 300);
    const remaining = Math.ceil((cooldown * 1000 - (Date.now() - parseInt(lastAttempt))) / 1000);
    if (remaining > 0) {
      throw new Error(`Terlalu banyak percobaan. Coba lagi dalam ${remaining} detik`);
    }
  }

  try {
    const hashed = hashPassword(password);

    const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    const user = users.find(u => u.email === email && u.password === hashed);

    const admin = JSON.parse(localStorage.getItem(ADMIN_KEY));
    if (admin && admin.email === email && admin.password === hashed) {
      localStorage.setItem(ADMIN_KEY, JSON.stringify({ ...admin, isLoggedIn: true }));
      createSecureSession(admin);
      localStorage.removeItem(LOGIN_ATTEMPT_KEY);
      return { ...admin, role: 'admin' };
    }

    if (user) {
      user.isLoggedIn = true;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      createSecureSession(user);
      localStorage.removeItem(LOGIN_ATTEMPT_KEY);
      return { ...user, role: 'user' };
    }

    throw new Error('Email atau password salah.');
  } catch (error) {
    localStorage.setItem(LOGIN_ATTEMPT_KEY, attempts + 1);
    localStorage.setItem('last_attempt', Date.now());
    throw error;
  }
}

function getCurrentSession() {
  const session = validateSession();
  if (!session) return null;

  if (session.userId === 'admin@tokoku.com') {
    return JSON.parse(localStorage.getItem(ADMIN_KEY));
  }

  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  return users.find(u => u.email === session.userId) || null;
}

function refreshSession() {
  const sessionRef = JSON.parse(localStorage.getItem(SESSION_KEY));
  if (sessionRef) {
    sessionRef.lastActive = new Date().toISOString();
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionRef));
  }
}

function forceLogin(email) {
  const users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  const user = users.find(u => u.email === email);

  if (user) {
    user.isLoggedIn = true;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    createSecureSession(user);
    return true;
  }
  return false;
}
function getCurrentUser() {
  return getCurrentSession();
}