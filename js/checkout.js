// checkout.js - SHOPIRE

(function(){
  if(localStorage.getItem('shopire_dark')==='true'){
    document.documentElement.setAttribute('data-theme','dark');
  }
})();

if (!isLoggedIn()) window.location.href = 'login.html';

let cartTotal = 0, cartItems = [], discount = 0, payMethod = 'card';
const PROMOS = { 'SAVE10': 10, 'SHOPIRE20': 20, 'WELCOME15': 15 };

// ── Cart Load ──
async function loadCart() {
  try {
    const cart = await Cart.get();
    const container = document.getElementById('orderItems');
    if (!cart.items || cart.items.length === 0) {
      container.innerHTML = '<div class="empty-msg">🛒 Cart is empty! <a href="shop.html" style="color:var(--red)">Start Shopping</a></div>';
      document.getElementById('placeBtn').disabled = true;
      return;
    }
    cartItems = cart.items;
    container.innerHTML = cart.items.map(item => `
      <div class="order-item">
        <img src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://placehold.co/52x52/f0f0f0/999?text=P'"/>
        <div class="order-item-info">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-qty">Qty: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}</div>
        </div>
        <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
      </div>`).join('');
    cartTotal = parseFloat(cart.total);
    updateTotals();
    document.getElementById('orderSummary').style.display = 'block';
    const user = getUser();
    if (user) {
      document.getElementById('dName').value = user.name || '';
      document.getElementById('dEmail').value = user.email || '';
    }
  } catch (e) {
    document.getElementById('orderItems').innerHTML = '<div class="empty-msg">Could not load cart. <a href="cart.html" style="color:var(--red)">Check Cart</a></div>';
  }
}

function updateTotals() {
  const disc = cartTotal * (discount / 100);
  const after = cartTotal - disc;
  const tax = after * 0.05;
  const total = after + tax;
  document.getElementById('subtotal').textContent = '$' + cartTotal.toFixed(2);
  document.getElementById('taxAmt').textContent = '$' + tax.toFixed(2);
  document.getElementById('orderTotal').textContent = '$' + total.toFixed(2);
  const dRow = document.getElementById('discountRow');
  if (discount > 0) {
    dRow.style.display = 'flex';
    document.getElementById('discountAmt').textContent = '-$' + disc.toFixed(2);
  } else {
    dRow.style.display = 'none';
  }
}

// ── Promo Code ──
function applyPromo() {
  const code = document.getElementById('promoInput').value.trim().toUpperCase();
  const msgEl = document.getElementById('promoMsg');
  msgEl.style.display = 'block';
  if (!code) { msgEl.textContent = 'Enter a promo code'; msgEl.style.color = '#e53e3e'; return; }
  if (PROMOS[code]) {
    discount = PROMOS[code];
    document.getElementById('promoLabel').textContent = `(${code})`;
    msgEl.textContent = `✅ "${code}" applied — ${discount}% off!`;
    msgEl.style.color = '#16a34a';
    updateTotals();
  } else {
    discount = 0;
    updateTotals();
    msgEl.textContent = '❌ Invalid promo code';
    msgEl.style.color = '#e53e3e';
  }
}

// ── Payment method switch ──
window.setPayMethod = function(method) {
  payMethod = method;
  document.getElementById('cardSection').style.display = method === 'card' ? 'block' : 'none';
  document.getElementById('codSection').style.display  = method === 'cod'  ? 'block' : 'none';
  document.getElementById('tabCard').classList.toggle('active', method === 'card');
  document.getElementById('tabCod').classList.toggle('active',  method === 'cod');
  document.getElementById('placeBtn').innerHTML = method === 'cod'
    ? '<i class="fas fa-box"></i> Confirm COD Order'
    : '<i class="fas fa-lock"></i> Place Order Securely';
};

// ── Card Live Preview ──
window.flipCard = function(toBack) {
  document.getElementById('cardInner').classList.toggle('flipped', toBack);
};

window.updatePreview = function() {
  const name = document.getElementById('cardName').value || 'FULL NAME';
  document.getElementById('prevName').textContent = name.toUpperCase().slice(0,22);
};

window.formatCard = function(input) {
  let v = input.value.replace(/\D/g,'').slice(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
  const display = (v + '•'.repeat(16 - v.length)).replace(/(.{4})/g,'$1 ').trim();
  document.getElementById('prevNum').textContent = display;
  // Detect card type
  const typeEl = document.getElementById('prevCardType');
  const badgeEl = document.getElementById('cardTypeIcon');
  if (/^4/.test(v))          { typeEl.innerHTML='<i class="fab fa-cc-visa" style="color:#1a1fe8"></i>';       badgeEl.innerHTML='<i class="fab fa-cc-visa" style="color:#1a1fe8"></i>'; }
  else if (/^5[1-5]/.test(v)){ typeEl.innerHTML='<i class="fab fa-cc-mastercard" style="color:#eb001b"></i>'; badgeEl.innerHTML='<i class="fab fa-cc-mastercard" style="color:#eb001b"></i>'; }
  else if (/^3[47]/.test(v)) { typeEl.innerHTML='<i class="fab fa-cc-amex" style="color:#2671b3"></i>';       badgeEl.innerHTML='<i class="fab fa-cc-amex" style="color:#2671b3"></i>'; }
  else                        { typeEl.innerHTML='<i class="fab fa-cc-visa"></i>';                             badgeEl.innerHTML=''; }
};

window.formatExp = function(input) {
  let v = input.value.replace(/\D/g,'');
  if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
  input.value = v;
  document.getElementById('prevExp').textContent = v || 'MM/YY';
};

window.updateCvv = function(input) {
  document.getElementById('prevCvv').textContent = '•'.repeat(input.value.length) || '•••';
};

// ── Validate card ──
function validateCard() {
  const num  = document.getElementById('cardNum').value.replace(/\s/g,'');
  const name = document.getElementById('cardName').value.trim();
  const exp  = document.getElementById('cardExp').value.trim();
  const cvv  = document.getElementById('cardCvv').value.trim();
  if (num.length < 16)  return 'Enter a valid 16-digit card number';
  if (!name)            return 'Enter cardholder name';
  if (!/^\d{2}\/\d{2}$/.test(exp)) return 'Enter expiry as MM/YY';
  const [mm, yy] = exp.split('/').map(Number);
  const now = new Date(); const nowYY = now.getFullYear() % 100; const nowMM = now.getMonth() + 1;
  if (mm < 1 || mm > 12) return 'Invalid expiry month';
  if (yy < nowYY || (yy === nowYY && mm < nowMM)) return 'Card has expired';
  if (cvv.length < 3)   return 'Enter valid CVV';
  return null;
}

// ── Place Order ──
window.placeOrder = async function() {
  const name    = document.getElementById('dName').value.trim();
  const email   = document.getElementById('dEmail').value.trim();
  const phone   = document.getElementById('dPhone').value.trim();
  const address = document.getElementById('dAddress').value.trim();
  const city    = document.getElementById('dCity').value;
  const zip     = document.getElementById('dZip').value.trim();
  const notes   = document.getElementById('dNotes').value.trim();

  if (!name || !email || !address || !city)
    return showMsg('Please fill in all required delivery fields.', 'error');
  if (!phone)
    return showMsg('Phone number is required for delivery.', 'error');
  if (cartItems.length === 0)
    return showMsg('Your cart is empty!', 'error');

  if (payMethod === 'card') {
    const cardErr = validateCard();
    if (cardErr) return showMsg(cardErr, 'error');
  }

  const disc = cartTotal * (discount / 100);
  const after = cartTotal - disc;
  const tax = after * 0.05;
  const finalTotal = after + tax;

  const items = cartItems.map(i => ({ product_id: i.product_id, quantity: i.quantity, price: i.price }));
  const btn = document.getElementById('placeBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

  try {
    const res = await Orders.place({
      name, email, phone, address, city, zip, notes,
      paymentMethod: payMethod,
      discount, tax: tax.toFixed(2),
      items, total: finalTotal.toFixed(2)
    });
    const orderId = res.orderId || res.order_id || res.id || 'SHP' + Date.now();
    document.getElementById('successOrderId').textContent = 'Order ID: #' + orderId;
    document.getElementById('successModal').style.display = 'flex';
    btn.innerHTML = '✅ Order Placed!';
  } catch (e) {
    showMsg(e.message || 'Could not place order. Please try again.', 'error');
    btn.disabled = false;
    btn.innerHTML = payMethod === 'cod'
      ? '<i class="fas fa-box"></i> Confirm COD Order'
      : '<i class="fas fa-lock"></i> Place Order Securely';
  }
};

function showMsg(text, type) {
  const el = document.getElementById('mainMsg');
  el.textContent = text;
  el.className = 'msg ' + type;
  el.style.display = 'block';
  el.scrollIntoView({ behavior:'smooth', block:'center' });
}

loadCart();

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.checked = localStorage.getItem('shopire_dark') === 'true';
    toggle.addEventListener('change', () => {
      document.documentElement.setAttribute('data-theme', toggle.checked ? 'dark' : 'light');
      localStorage.setItem('shopire_dark', String(toggle.checked));
    });
  }
});
