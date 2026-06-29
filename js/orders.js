// orders.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



    if (!isLoggedIn()) window.location.href = 'login.html';

    const statusBadge = s => `<span class="badge badge-${s}">${s}</span>`;

    async function loadOrders() {
      const container = document.getElementById('ordersContainer');
      try {
        const orders = await Orders.myOrders();
        if (!orders.length) {
          container.innerHTML = `<div class="empty"><i class="fas fa-shopping-bag"></i><h3>No orders found</h3><p>You haven't placed any orders yet</p><a href="shop.html" class="btn-red"><i class="fas fa-bolt"></i> Shop Now</a></div>`;
          return;
        }
        container.innerHTML = orders.map(o => `
          <div class="order-card">
            <div class="order-header">
              <div>
                <div class="order-id">Order #${o.id}</div>
                <div class="order-date">${new Date(o.created_at).toLocaleDateString('ur-PK',{year:'numeric',month:'long',day:'numeric'})}</div>
              </div>
              ${statusBadge(o.status)}
            </div>
            ${(o.items||[]).map(item => `
              <div class="order-item">
                <img src="${item.image||''}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/50?text=P'"/>
                <div>
                  <div class="item-name">${item.name}</div>
                  <div class="item-sub">Qty: ${item.quantity} × $${parseFloat(item.price).toFixed(2)}</div>
                </div>
                <div class="item-price">$${(item.quantity*item.price).toFixed(2)}</div>
              </div>
            `).join('')}
            <div class="order-footer">
              <div style="font-size:13px;color:var(--muted)"><i class="fas fa-map-marker-alt"></i> ${o.city||''} ${o.address||''}</div>
              <div class="order-total" style="color:var(--red)">Total: $${parseFloat(o.total).toFixed(2)}</div>
            </div>
          </div>
        `).join('');
      } catch (e) {
        container.innerHTML = `<div class="empty"><i class="fas fa-exclamation-triangle"></i><h3>Error</h3><p>${e.message}</p></div>`;
      }
    }
    loadOrders();
  


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