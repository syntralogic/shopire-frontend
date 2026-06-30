// shop.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  // Grid / List view toggle
  function setView(type) {
    const grid = document.getElementById('productsGrid');
    const gridBtn = document.getElementById('gridBtn');
    const listBtn = document.getElementById('listBtn');
    if (type === 'list') {
      grid.classList.add('list-view');
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
    } else {
      grid.classList.remove('list-view');
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
    }
  }

  function clearFilters() {
    document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.filter-sidebar input[type="radio"]').forEach(r => r.checked = false);
    document.getElementById('priceRange').value = 5000;
    document.getElementById('maxPrice').value = 5000;
  }

  // Wishlist toggle
  document.querySelectorAll('.card-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i');
      icon.classList.toggle('far');
      icon.classList.toggle('fas');
      btn.style.color = icon.classList.contains('fas') ? 'var(--red)' : '';
    });
  });

  // Swatch toggle
  document.querySelectorAll('.swatch').forEach(s => {
    s.addEventListener('click', () => {
      document.querySelectorAll('.swatch').forEach(x => x.classList.remove('active'));
      s.classList.add('active');
    });
  });

  // Pagination
  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.classList.contains('dots')) return;
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  function toggleDropdown() {
    const dd = document.getElementById('browseDropdown');
    const showing = dd.style.display === 'block';
    dd.style.display = showing ? 'none' : 'block';
  }
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#browseBtn') && !e.target.closest('#browseDropdown')) {
      const dd = document.getElementById('browseDropdown');
      if(dd) dd.style.display = 'none';
    }
  });




  // ── Load Products from Database ──
  async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    const loadingEl = document.getElementById('productsLoading');
    const errorEl = document.getElementById('productsError');
    try {
      const data = await Products.getAll();
      const products = data.products || data;
      if (loadingEl) loadingEl.style.display = 'none';

      if (!products || products.length === 0) {
        if (errorEl) { errorEl.style.display = 'block'; errorEl.innerHTML = '<i class="fas fa-box-open" style="font-size:40px;color:#ccc;margin-bottom:16px;display:block"></i><h3 style="color:#333">No products found</h3><p style="color:#777">Please add products in the database</p>'; }
        return;
      }

      grid.innerHTML = '';
      products.forEach(p => {
        const discount = p.old_price ? Math.round((1 - p.price / p.old_price) * 100) : 0;
        const badge = p.badge || (discount > 0 ? `-${discount}%` : '');
        const badgeColor = badge === 'NEW' ? '#10b981' : badge === 'HOT' ? '#f59e0b' : 'var(--red)';
        const stars = Math.round(p.rating || 0);
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
          starsHtml += `<i class="${i <= stars ? 'fas' : 'far'} fa-star"></i>`;
        }
        grid.innerHTML += `
          <div class="product-card" onclick="window.location.href='product-detail.html?id=${p.id}'">
            ${badge ? `<div class="card-badge" style="background:${badgeColor}">${badge}</div>` : ''}
            <div class="card-wish" data-pid="${p.id}" onclick="event.stopPropagation()"><i class="far fa-heart"></i></div>
            <div class="card-img"><img src="${p.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300'"></div>
            <div class="card-content">
              <div class="card-body">
                <div class="card-cat">${p.category_name || 'Product'}</div>
                <div class="card-name">${p.name}</div>
                <div class="card-rating">${starsHtml}<span>(${p.rating || 0} · ${p.reviews_count || 0} reviews)</span></div>
                <div class="card-price">
                  <span class="price-now">$${parseFloat(p.price).toFixed(2)}</span>
                  ${p.old_price ? `<span class="price-old">$${parseFloat(p.old_price).toFixed(2)}</span>` : ''}
                </div>
              </div>
              <div class="card-actions">
                <button class="btn-addcart" onclick="event.stopPropagation(); addToCart('${p.id}', this)">Add to Cart</button>
                <button class="btn-icon-sm" title="Quick View" onclick="event.stopPropagation(); window.location.href='product-detail.html?id=${p.id}'"><i class="fas fa-eye"></i></button>
              </div>
            </div>
          </div>`;
      });

      // Re-attach wishlist events with localStorage
      const wl = JSON.parse(localStorage.getItem('shopire_wishlist') || '[]');
      document.querySelectorAll('.card-wish').forEach(btn => {
        const pid = btn.getAttribute('data-pid');
        const icon = btn.querySelector('i');
        if (pid && wl.includes(pid)) {
          icon.classList.replace('far', 'fas');
          btn.style.color = 'var(--red)';
        }
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!pid) return;
          const list = JSON.parse(localStorage.getItem('shopire_wishlist') || '[]');
          const idx = list.indexOf(pid);
          if (idx === -1) {
            list.push(pid);
            icon.classList.replace('far', 'fas');
            btn.style.color = 'var(--red)';
            showToast('Added to Wishlist! ❤️', 'success');
          } else {
            list.splice(idx, 1);
            icon.classList.replace('fas', 'far');
            btn.style.color = '';
            showToast('Removed from Wishlist', 'info');
          }
          localStorage.setItem('shopire_wishlist', JSON.stringify(list));
        });
      });

    } catch (err) {
      console.log('Products load error:', err.message);
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'block';
    }
  }

  // ── Add to Cart from Shop Page ──
  async function addToCart(productId, btn) {
    if (!isLoggedIn()) {
      showToast('Please login first!', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }
    try {
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Adding...';
      await Cart.add(productId, 1);
      showToast('Added to Cart! 🛒', 'success');
      btn.textContent = '✓ Added!';
      await updateCartBadge();
      setTimeout(() => { btn.disabled = false; btn.textContent = origText; }, 2000);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.textContent = 'Add to Cart';
    }
  }

  document.addEventListener('DOMContentLoaded', loadProducts);
  


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