// checkout.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



    if (!isLoggedIn()) window.location.href = 'login.html';

    let cartTotal = 0;
    let cartItems = [];

    async function loadCart() {
      try {
        const cart = await Cart.get();
        const container = document.getElementById('orderItems');
        if (!cart.items || cart.items.length === 0) {
          container.innerHTML = '<div class="empty-msg">Cart is empty! <a href="shop.html" style="color:var(--red)">Start Shopping</a></div>';
          document.getElementById('placeBtn').disabled = true;
          return;
        }
        cartItems = cart.items;
        container.innerHTML = cart.items.map(item => `
          <div class="order-item">
            <img src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/56x56?text=P'"/>
            <div class="order-item-info">
              <div class="order-item-name">${item.name}</div>
              <div class="order-item-qty">Qty: ${item.quantity}</div>
            </div>
            <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('');
        cartTotal = parseFloat(cart.total);
        document.getElementById('subtotal').textContent = '$' + cart.total;
        document.getElementById('orderTotal').textContent = '$' + cart.total;
        document.getElementById('orderSummary').style.display = 'block';
        // Pre-fill from profile
        const user = getUser();
        if (user) {
          document.getElementById('dName').value = user.name || '';
          document.getElementById('dEmail').value = user.email || '';
        }
      } catch (e) {
        document.getElementById('orderItems').innerHTML = '<div class="empty-msg">Cart could not be loaded. <a href="cart.html">Check Cart</a></div>';
      }
    }

    function showMsg(text, type) {
      const el = document.getElementById('mainMsg');
      el.textContent = text;
      el.className = 'msg ' + type;
      el.style.display = 'block';
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async function placeOrder() {
      const name = document.getElementById('dName').value.trim();
      const email = document.getElementById('dEmail').value.trim();
      const phone = document.getElementById('dPhone').value.trim();
      const address = document.getElementById('dAddress').value.trim();
      const city = document.getElementById('dCity').value.trim();
      if (!name || !email || !address) return showMsg('Name, email and address are required!', 'error');
      if (cartItems.length === 0) return showMsg('Cart is empty!', 'error');

      const items = cartItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const btn = document.getElementById('placeBtn');
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing order...';
      try {
        const res = await Orders.place({ name, email, phone, address, city, items, total: cartTotal });
        showMsg('✅ Order placed successfully! Order ID: #' + (res.orderId || res.order_id), 'success');
        btn.innerHTML = '✅ Order Placed!';
        setTimeout(() => window.location.href = 'orders.html', 2000);
      } catch (e) {
        showMsg(e.message, 'error');
        btn.disabled = false; btn.innerHTML = '<i class="fas fa-check-circle"></i> Place Order';
      }
    }

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