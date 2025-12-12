
const KEY = 'jobportal_credentials';

export function loadCredentials() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCredentials(list) {
  localStorage.setItem(KEY, JSON.stringify(list || []));
}

export function registerCredential({ email, password, role }) {
  const list = loadCredentials();
  // prevent duplicate email
  if (list.some(u => u.email === email)) {
    return { success: false, message: 'Email already registered' };
  }
  list.push({ email, password, role });
  saveCredentials(list);
  return { success: true };
}

export function findCredential(email, password) {
  const list = loadCredentials();
  return list.find(u => u.email === email && u.password === password) || null;
}

export function findByEmail(email) {
  const list = loadCredentials();
  return list.find(u => u.email === email) || null;
}
