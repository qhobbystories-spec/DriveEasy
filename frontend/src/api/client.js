const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const TOKEN_KEY = 'amk_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, { method = 'GET', body, token, headers = {} } = {}) {
  const authToken = token || getToken();

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let json = {};
  try {
    json = await res.json();
  } catch (e) {
    // Non-JSON response; fall through
  }

  if (!res.ok) {
    const err = new Error(json.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = json;
    throw err;
  }

  return json;
}

export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) =>
    request('/auth/register', { method: 'POST', body: payload }),
  logout: () =>
    request('/auth/logout', { method: 'POST' }),
  me: () =>
    request('/users/profile/me'),
  forgotPassword: (email) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, password) =>
    request('/auth/reset-password', { method: 'POST', body: { token, password } }),
  verifyEmail: (token) =>
    request('/auth/verify-email', { method: 'POST', body: { token } }),
  createContact: (payload) =>
    request('/contact', { method: 'POST', body: payload }),
  cars: {
    list: () =>
      request('/cars?limit=100'),
    create: (payload) =>
      request('/cars', { method: 'POST', body: payload }),
    remove: (id) =>
      request(`/cars/${id}`, { method: 'DELETE' }),
  },
  parts: {
    list: () =>
      request('/parts?limit=100'),
    create: (payload) =>
      request('/parts', { method: 'POST', body: payload }),
    remove: (id) =>
      request(`/parts/${id}`, { method: 'DELETE' }),
  },
  towing: {
    list: () =>
      request('/towing?limit=100'),
    create: (payload) =>
      request('/towing', { method: 'POST', body: payload }),
    remove: (id) =>
      request(`/towing/${id}`, { method: 'DELETE' }),
  },
  bookings: {
    list: () =>
      request('/bookings?limit=100'),
    create: (payload) =>
      request('/bookings', { method: 'POST', body: payload }),
    cancel: (id) =>
      request(`/bookings/${id}`, { method: 'DELETE' }),
    approve: (id) =>
      request(`/bookings/${id}/approve`, { method: 'POST' }),
    reject: (id, reason) =>
      request(`/bookings/${id}/reject`, { method: 'POST', body: { reason } }),
    activate: (id) =>
      request(`/bookings/${id}/activate`, { method: 'POST' }),
    complete: (id) =>
      request(`/bookings/${id}/complete`, { method: 'POST' }),
    return: (id) =>
      request(`/bookings/${id}/return`, { method: 'POST' }),
  },
  payments: {
    create: (payload) =>
      request('/payments', { method: 'POST', body: payload }),
  },
  dashboard: {
    stats: () =>
      request('/dashboard/stats'),
  },
  users: {
    list: () =>
      request('/users?limit=100'),
  },
  notifications: {
    list: () =>
      request('/notifications?limit=20'),
    markAllRead: () =>
      request('/notifications/mark-all-read', { method: 'PUT' }),
  },
  maintenance: {
    list: () =>
      request('/maintenance?limit=100'),
    create: (payload) =>
      request('/maintenance', { method: 'POST', body: payload }),
    update: (id, payload) =>
      request(`/maintenance/${id}`, { method: 'PUT', body: payload }),
    remove: (id) =>
      request(`/maintenance/${id}`, { method: 'DELETE' }),
  },
  coupons: {
    validate: (code) =>
      request('/coupons/validate', { method: 'POST', body: { code } }),
  },
};
