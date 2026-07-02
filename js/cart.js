// cart.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  // ── BACKEND CONNECTED CART ──
  let couponApplied = false;
  let cartData = [];

  async function loadCart() {
    const itemsEl = document.getElementById('cartItems');
    const emptyEl = document.getElementById('emptyCart');
    const couponRow = document.querySelector('.coupon-row');
    const bottomRow = document.querySelector('.bottom-row');

    if (!isLoggedIn()) {
      itemsEl.innerHTML = '';
      emptyEl.style.display = 'flex';
      emptyEl.innerHTML = `<div class="empty-icon">🔐</div><h3>Login</h3><p>Please login to view your cart</p><a href="login.html"><button class="btn-shop-now"><i class="fas fa-sign-in-alt"></i> Login</button></a>`;
      couponRow.style.display = 'none';
      bottomRow.style.display = 'none';
      return;
    }

    try {
      const cart = await Cart.get();
      cartData = cart.items || [];

      if (cartData.length === 0) {
        itemsEl.innerHTML = '';
        emptyEl.style.display = 'flex';
        couponRow.style.display = 'none';
        bottomRow.style.display = 'none';
        setTotals(0, 0, 0, 0);
        document.getElementById('cartCount').textContent = '0';
        return;
      }

      emptyEl.style.display = 'none';
      couponRow.style.display = '';
      bottomRow.style.display = '';

      itemsEl.innerHTML = cartData.map(item => `
        <div class="cart-item" id="ci-${item.id}">
          <div class="item-img">
            <img src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/200x200?text=Product'">
          </div>
          <div class="item-info">
            <div class="item-cat">Product</div>
            <div class="item-name">${item.name}</div>
          </div>
          <div class="item-qty">
            <button onclick="changeQty('${item.id}', ${item.quantity}, -1)">−</button>
            <input type="number" id="qty-${item.id}" value="${item.quantity}" min="1" onchange="syncQty('${item.id}', this.value)">
            <button onclick="changeQty('${item.id}', ${item.quantity}, 1)">+</button>
          </div>
          <div class="item-price-col">
            <div class="item-unit-price">$${parseFloat(item.price).toFixed(2)} each</div>
            <div class="item-total" id="total-${item.id}">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
          <button class="item-remove" onclick="removeItem('${item.id}')" title="Remove"><i class="fas fa-times"></i></button>
        </div>
      `).join('');

      recalc();
    } catch (e) {
      itemsEl.innerHTML = `<p style="padding:20px;color:red">Cart could not be loaded: ${e.message}</p>`;
    }
  }

  function recalc() {
    let subtotal = 0;
    cartData.forEach(item => {
      const qtyEl = document.getElementById('qty-' + item.id);
      const qty = qtyEl ? parseInt(qtyEl.value) : item.quantity;
      const lineTotal = parseFloat(item.price) * qty;
      subtotal += lineTotal;
      const el = document.getElementById('total-' + item.id);
      if (el) el.textContent = '$' + lineTotal.toFixed(2);
    });

    let discounted = subtotal;
    if (couponApplied) {
      const disc = subtotal * 0.10;
      discounted = subtotal - disc;
      document.getElementById('discountRow').style.display = 'flex';
      document.getElementById('discountVal').textContent = '− $' + disc.toFixed(2);
    }
    const tax = discounted * 0.08;
    const total = discounted + tax;
    setTotals(subtotal, tax, total, cartData.length);
    document.getElementById('cartCount').textContent = cartData.length;
    if (document.getElementById('cartBadge')) document.getElementById('cartBadge').textContent = cartData.length;
  }

  function setTotals(sub, tax, total, count) {
    const fmt = n => '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    document.getElementById('subtotalVal').textContent = fmt(sub);
    document.getElementById('taxVal').textContent = fmt(tax);
    document.getElementById('totalVal').textContent = fmt(total);
    document.getElementById('itemCount').textContent = count;
  }

  async function changeQty(cartItemId, currentQty, delta) {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await Cart.update(cartItemId, newQty);
      const item = cartData.find(i => i.id === cartItemId);
      if (item) item.quantity = newQty;
      const el = document.getElementById('qty-' + cartItemId);
      if (el) el.value = newQty;
      recalc();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function syncQty(cartItemId, val) {
    const newQty = parseInt(val);
    if (!newQty || newQty < 1) return;
    try {
      await Cart.update(cartItemId, newQty);
      const item = cartData.find(i => i.id === cartItemId);
      if (item) item.quantity = newQty;
      recalc();
    } catch (e) { showToast(e.message, 'error'); }
  }

  async function removeItem(cartItemId) {
    const el = document.getElementById('ci-' + cartItemId);
    if (el) { el.style.opacity = '0'; el.style.transform = 'translateX(30px)'; el.style.transition = 'all .3s'; }
    try {
      await Cart.remove(cartItemId);
      cartData = cartData.filter(i => i.id !== cartItemId);
      setTimeout(() => { if (el) el.remove(); recalc(); if (cartData.length === 0) loadCart(); }, 300);
      showToast('Item removed');
    } catch (e) { showToast(e.message, 'error'); if (el) { el.style.opacity = '1'; el.style.transform = ''; } }
  }

  async function clearCart() {
    if (!confirm('Remove all items from cart?')) return;
    try {
      await Cart.clear();
      cartData = [];
      loadCart();
      showToast('Cart cleared');
    } catch (e) { showToast(e.message, 'error'); }
  }

  function applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    if (code === 'SAVE10') {
      couponApplied = true;
      document.getElementById('couponMsg').style.display = 'inline';
      document.getElementById('couponMsg').style.color = '#10b981';
      document.getElementById('couponMsg').textContent = '✓ 10% discount applied!';
      document.getElementById('couponInput').style.borderColor = '#10b981';
      recalc();
    } else {
      document.getElementById('couponMsg').style.color = '#ef4444';
      document.getElementById('couponMsg').textContent = '✗ Galat coupon code';
      document.getElementById('couponMsg').style.display = 'inline';
      document.getElementById('couponInput').style.borderColor = '#ef4444';
      couponApplied = false;
      recalc();
    }
  }

  function updateCart() {
    const btn = document.querySelector('.btn-update');
    btn.innerHTML = '<i class="fas fa-check"></i> Updated!';
    btn.style.background = '#10b981';
    setTimeout(() => { btn.innerHTML = '<i class="fas fa-sync-alt"></i> Update Cart'; btn.style.background = ''; }, 2000);
    recalc();
  }

  function checkout() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return; }
    window.location.href = 'checkout.html';
  }

  // Init
  loadCart();



  // Dark mode toggle listener only (setAttribute already done in <head>)
  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.getElementById('darkModeToggle');
    if (toggle) {
      toggle.checked = localStorage.getItem('shopire_dark') === 'true';
      toggle.addEventListener('change', function() {
        var isDark = toggle.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('shopire_dark', String(isDark));
      });
    }
  });