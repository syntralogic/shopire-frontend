// ============================================================
// SHOPIRE Admin - api.js (admin folder version)
// Location: admin/js/api.js
// ============================================================

const API_URL = 'https://shopire-backend.onrender.com/api';

// ── Token Helper ──
const getToken   = () => localStorage.getItem('shopire_token');
const getUser    = () => JSON.parse(localStorage.getItem('shopire_user') || 'null');
const isLoggedIn = () => !!getToken();
const isAdmin    = () => getUser()?.role === 'admin';

// ── Base Fetch ──
async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Server error');
    return data;
  } catch (err) {
    if (err.message.includes('fetch') || err.message.includes('Failed')) {
      throw new Error('Backend server is not running. In CMD run: cd shopire-backend && npm start');
    }
    throw err;
  }
}

// ── AUTH ──
const Auth = {
  async login(email, password) {
    const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('shopire_token', data.token);
    localStorage.setItem('shopire_user', JSON.stringify(data.user));
    return data;
  },
  logout() {
    localStorage.removeItem('shopire_token');
    localStorage.removeItem('shopire_user');
    window.location.href = 'login.html';
  }
};

// ── PRODUCTS ──
const Products = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/products${query ? '?' + query : ''}`);
  },
  async getOne(id)       { return apiFetch(`/products/${id}`); },
  async add(data)        { return apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }); },
  async update(id, data) { return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async delete(id)       { return apiFetch(`/products/${id}`, { method: 'DELETE' }); }
};

// ── ORDERS ──
const Orders = {
  async allOrders()              { return apiFetch('/orders/all'); },
  async updateStatus(id, status) { return apiFetch(`/orders/status/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }); }
};
