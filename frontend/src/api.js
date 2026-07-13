const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include', ...options, headers });

  const contentType = response.headers.get('content-type');
  const body = contentType?.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    throw new Error(body?.message || body || response.statusText || 'API request failed');
  }

  return body;
}

export async function register(data) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function login(data) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify(data) });
}

export async function getServices(token) {
  return request('/services', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
}

export async function createService(token, data) {
  return request('/services', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
}

export async function createBooking(data) {
  return request('/bookings', { method: 'POST', body: JSON.stringify(data) });
}

export async function getBookings(token) {
  return request('/bookings', { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
}
