export const API_BASE = window.StreamVaultConfig?.apiBase || '/api';
export const state = { token: localStorage.getItem('sv_token'), user: JSON.parse(localStorage.getItem('sv_user') || 'null') };

export function setSession(token, user) {
  state.token = token;
  state.user = user;
  if (token) localStorage.setItem('sv_token', token); else localStorage.removeItem('sv_token');
  if (user) localStorage.setItem('sv_user', JSON.stringify(user)); else localStorage.removeItem('sv_user');
  window.dispatchEvent(new CustomEvent('session-changed'));
}

export async function api(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (!(options.body instanceof FormData)) headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API_BASE}${path}`, { ...options, headers, body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}
