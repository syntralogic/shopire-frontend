// product-detail.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  // Thumbnail image switch
  function changeImg(el, src) {
    document.getElementById('mainImg').src = src;
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  // Tabs
  function openTab(e, id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    const map = { description:'description', specifications:'specifications', reviews:'reviews-tab', shipping:'shipping' };
    document.getElementById(map[id]).classList.add('active');
    e.target.classList.add('active');
  }

  // Qty
  function changeQty(d) {
    const el = document.getElementById('qty');
    let v = parseInt(el.value) + d;
    if (v < 1) v = 1;
    el.value = v;
  }

  // Color select
  function selectColor(el, name) {
    document.querySelectorAll('.color-opt').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('selectedColor').textContent = name;
  }

  // Size select
  function selectSize(el) {
    document.querySelectorAll('.size-opt').forEach(s => s.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('selectedSize').textContent = el.textContent;
  }

  // Wishlist
  function toggleWish(btn) {
    const i = btn.querySelector('i');
    i.classList.toggle('far'); i.classList.toggle('fas');
    btn.style.color = i.classList.contains('fas') ? 'var(--red)' : '';
    btn.style.borderColor = i.classList.contains('fas') ? 'var(--red)' : '';
  }



  // ── Get product ID from URL ──
  const urlParams = new URLSearchParams(window.location.search);
  const PRODUCT_ID = urlParams.get('id');

  // ── Load product from database ──
  async function loadProduct() {
    if (!PRODUCT_ID) return; // Static page fallback

    try {
      const product = await Products.getOne(PRODUCT_ID);

      // Update title
      document.title = 'SHOPIRE - ' + product.name;

      // Update main image
      if (product.image) {
        document.getElementById('mainImg').src = product.image;
        document.querySelectorAll('.thumb img').forEach(img => img.src = product.image);
      }

      // Update badge
      const badge = document.querySelector('.img-badge');
      if (badge) badge.textContent = product.badge || '';

      // Update category
      const catEl = document.querySelector('.prod-cat');
      if (catEl) catEl.innerHTML = `<i class="fas fa-tag"></i> ${product.category_name || 'Product'}`;

      // Update title
      const titleEl = document.querySelector('.prod-title');
      if (titleEl) titleEl.textContent = product.name;

      // Update price
      document.querySelector('.price-main').textContent = '$' + parseFloat(product.price).toFixed(2);
      const strikeEl = document.querySelector('.price-strike');
      if (product.old_price) {
        strikeEl.textContent = '$' + parseFloat(product.old_price).toFixed(2);
        const saved = (product.old_price - product.price).toFixed(2);
        document.querySelector('.price-save').textContent = 'You Save $' + saved + '!';
      } else {
        strikeEl.style.display = 'none';
        document.querySelector('.price-save').style.display = 'none';
      }

      // Update stock
      const stockText = document.querySelector('.stock-text');
      const stockCount = document.querySelector('.stock-count');
      if (product.stock > 0) {
        stockText.textContent = 'In Stock';
        stockCount.textContent = '— Only ' + product.stock + ' left!';
      } else {
        stockText.textContent = 'Out of Stock';
        stockText.style.color = '#ef4444';
        document.querySelector('.stock-dot').style.background = '#ef4444';
        stockCount.textContent = '';
        document.querySelector('.btn-cart').disabled = true;
        document.querySelector('.btn-cart').style.opacity = '0.5';
      }

      // Update description
      const descEl = document.querySelector('.prod-desc');
      if (descEl && product.description) descEl.textContent = product.description;

      // Update rating
      const ratingText = document.querySelector('.rating-text');
      if (ratingText) ratingText.innerHTML = `${product.rating || 0} / 5.0 &nbsp;|&nbsp; <a href="#reviews">${product.reviews_count || 0} Reviews</a>`;

      // Update breadcrumb
      const bcSpan = document.querySelector('.breadcrumb span');
      if (bcSpan) bcSpan.textContent = product.name;

    } catch (err) {
      console.log('Product load error:', err.message);
    }
  }

  // ── Add to Cart ──
  async function addToCart() {
    if (!isLoggedIn()) {
      showToast('Please login first!', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }

    const pid = PRODUCT_ID;
    const qty = parseInt(document.getElementById('qty').value) || 1;
    const btn = document.querySelector('.btn-cart');

    if (!pid) {
      showToast('Product not found.', 'error');
      return;
    }

    try {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
      await Cart.add(pid, qty);
      showToast('Added to Cart! 🛒', 'success');
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      await updateCartBadge();
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
      }, 2000);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
    }
  }

  // ── Load on page ready ──
  document.addEventListener('DOMContentLoaded', loadProduct);



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