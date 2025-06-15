// Enkripsi Password
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Manajemen Admin
const ADMIN_KEY = 'tokoku_admin_data';

function registerAdmin(email, passwordHash) {
  if (localStorage.getItem(ADMIN_KEY)) {
    throw new Error('Admin sudah terdaftar');
  }
  const adminData = {
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(ADMIN_KEY, JSON.stringify(adminData));
}

function verifyAdmin(email, passwordHash) {
  const adminData = JSON.parse(localStorage.getItem(ADMIN_KEY));
  if (!adminData) throw new Error('Admin belum terdaftar');
  return adminData.email === email && adminData.passwordHash === passwordHash;
}

// Manajemen Session
function createSession() {
  const session = {
    token: crypto.randomUUID(),
    expires: Date.now() + 3600000 // 1 jam
  };
  sessionStorage.setItem('admin_session', JSON.stringify(session));
  return session;
}

function validateSession() {
  const session = JSON.parse(sessionStorage.getItem('admin_session'));
  return session && session.expires > Date.now();
}

function logout() {
  sessionStorage.removeItem('admin_session');
  window.location.href = '../index.html';
}