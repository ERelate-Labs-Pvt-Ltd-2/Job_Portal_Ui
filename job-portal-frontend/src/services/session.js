

const KEY = 'jobportal_session';

export function setCurrentUser(user) {
  if (!user) return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}
