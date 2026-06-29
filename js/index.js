// index.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  // ── Countdown Timer ──
  function startTimer() {
    let totalSeconds = 8 * 3600 + 45 * 60 + 30;
    const h = document.getElementById('hours');
    const m = document.getElementById('mins');
    const s = document.getElementById('secs');
    if (!h) return;
    setInterval(() => {
      if (totalSeconds <= 0) return;
      totalSeconds--;
      h.textContent = String(Math.floor(totalSeconds / 3600)).padStart(2,'0');
      m.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2,'0');
      s.textContent = String(totalSeconds % 60).padStart(2,'0');
    }, 1000);
  }

  // ── Browse dropdown ──
  function toggleDropdown() {
    const dd = document.getElementById('browseDropdown');
    const arrow = document.getElementById('browseArrow');
    if (!dd) return;
    dd.classList.toggle('open');
    if (arrow) arrow.style.transform = dd.classList.contains('open') ? 'rotate(180deg)' : '';
  }
  document.addEventListener('click', function(e) {
    const dd = document.getElementById('browseDropdown');
    if (dd && !e.target.closest('.searchbar-wrap')) {
      dd.classList.remove('open');
      const arrow = document.getElementById('browseArrow');
      if (arrow) arrow.style.transform = '';
    }
  });

  // ── Add to Cart ──
  async function addToCart(productId, btn) {
    if (!isLoggedIn()) {
      showToast('Please login first!', 'error');
      setTimeout(() => window.location.href = 'login.html', 1500);
      return;
    }
    const orig = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
      await Cart.add(productId, 1);
      showToast('Added to Cart! 🛒', 'success');
      btn.innerHTML = '<i class="fas fa-check"></i> Added!';
      await updateCartBadge();
      setTimeout(() => { btn.disabled = false; btn.innerHTML = orig; }, 2000);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = orig;
    }
  }

  // ── Wishlist (localStorage) ──
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('shopire_wishlist') || '[]'); } catch { return []; }
  }
  function saveWishlist(list) {
    localStorage.setItem('shopire_wishlist', JSON.stringify(list));
  }
  function toggleWishlist(btn, productId) {
    if (productId === 0) { showToast('Go to the shop and add products to your wishlist!', 'info'); return; }
    const list = getWishlist();
    const icon = btn.querySelector('i');
    const idx = list.indexOf(productId);
    if (idx === -1) {
      list.push(productId);
      icon.classList.replace('far', 'fas');
      btn.style.color = 'var(--red)';
      showToast('Added to Wishlist! ❤️', 'success');
    } else {
      list.splice(idx, 1);
      icon.classList.replace('fas', 'far');
      btn.style.color = '';
      showToast('Removed from Wishlist', 'info');
    }
    saveWishlist(list);
    updateWishlistBadge();
  }
  function updateWishlistBadge() {
    const count = getWishlist().length;
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }
  function initWishlistUI() {
    const list = getWishlist();
    document.querySelectorAll('.card-wish[onclick*="toggleWishlist"]').forEach(btn => {
      const match = btn.getAttribute('onclick').match(/toggleWishlist\(this,\s*(\d+)\)/);
      if (!match) return;
      const id = parseInt(match[1]);
      if (list.includes(id)) {
        const icon = btn.querySelector('i');
        if (icon) { icon.classList.replace('far', 'fas'); btn.style.color = 'var(--red)'; }
      }
    });
    updateWishlistBadge();
  }

  // ── Dark Mode ── (setAttribute already done in <head>, just handle toggle)
  function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) {
      toggle.checked = localStorage.getItem('shopire_dark') === 'true';
      toggle.addEventListener('change', () => {
        const isDark = toggle.checked;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('shopire_dark', String(isDark));
      });
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    startTimer();
    initWishlistUI();
    initDarkMode();
  });