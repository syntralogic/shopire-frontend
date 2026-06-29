// ============================================================
// SHOPIRE Frontend API Helper
// Add this to each HTML file:
// <script src="js/api.js"></script>  (or "../js/api.js")
// ============================================================

const API_URL = 'http://localhost:5000/api';

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
      throw new Error('Backend server is not running. In CMD, run: cd shopire-backend && npm start');
    }
    throw err;
  }
}

// ── AUTH ──
const Auth = {
  async signup(name, email, password) {
    return apiFetch('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  },
  async login(email, password) {
    const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    localStorage.setItem('shopire_token', data.token);
    localStorage.setItem('shopire_user', JSON.stringify(data.user));
    updateNavUI();
    return data;
  },
  logout() {
    localStorage.removeItem('shopire_token');
    localStorage.removeItem('shopire_user');
    updateNavUI();
    window.location.href = 'index.html';
  },
  async profile() { return apiFetch('/auth/profile'); }
};

// ── PRODUCTS ──
const Products = {
  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/products${query ? '?' + query : ''}`);
  },
  async getOne(id)           { return apiFetch(`/products/${id}`); },
  async add(data)            { return apiFetch('/products', { method: 'POST', body: JSON.stringify(data) }); },
  async update(id, data)     { return apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
  async delete(id)           { return apiFetch(`/products/${id}`, { method: 'DELETE' }); },
  async categories()         { return apiFetch('/products/categories/all'); }
};

// ── CART ──
const Cart = {
  async get()                       { return apiFetch('/cart'); },
  async add(product_id, quantity=1) { return apiFetch('/cart/add', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }); },
  async update(id, quantity)        { return apiFetch(`/cart/update/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }); },
  async remove(id)                  { return apiFetch(`/cart/remove/${id}`, { method: 'DELETE' }); },
  async clear()                     { return apiFetch('/cart/clear', { method: 'DELETE' }); }
};

// ── ORDERS ──
const Orders = {
  async place(data)              { return apiFetch('/orders/place', { method: 'POST', body: JSON.stringify(data) }); },
  async myOrders()               { return apiFetch('/orders/my'); },
  async allOrders()              { return apiFetch('/orders/all'); },
  async updateStatus(id, status) { return apiFetch(`/orders/status/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }); }
};

// ── Update Nav UI based on login ──
function updateNavUI() {
  const user = getUser();
  document.querySelectorAll('.nav-login-link').forEach(el => el.style.display = user ? 'none' : '');
  document.querySelectorAll('.nav-user-menu').forEach(el => {
    el.style.display = user ? '' : 'none';
    el.textContent = user ? user.name : '';
  });
  document.querySelectorAll('.nav-admin-link').forEach(el => el.style.display = (user?.role === 'admin') ? '' : 'none');
}

// ── Show Toast Notification ──
function showToast(message, type = 'success') {
  const existing = document.getElementById('shopire-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'shopire-toast';
  toast.style.cssText = `
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#333'};
    color: white; padding: 12px 28px; border-radius: 50px;
    font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 14px;
    z-index: 999999; box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    animation: toastIn 0.3s ease; max-width: 90vw; text-align: center;
  `;
  toast.textContent = message;
  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }`;
    document.head.appendChild(s);
  }
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// ── Update Cart Count Badge ──
async function updateCartBadge() {
  if (!isLoggedIn()) return;
  try {
    const cart = await Cart.get();
    document.querySelectorAll('.cart-badge, [data-cart-count]').forEach(el => el.textContent = cart.count);
    document.querySelectorAll('a[href*="cart"] .badge, a[href*="cart.html"] .badge').forEach(el => el.textContent = cart.count);
  } catch {}
}

// ── Run on page load ──
document.addEventListener('DOMContentLoaded', () => {
  updateNavUI();
  updateCartBadge();
});
