// ============================================================
// SHOPIRE EXTRAS — Live Search, Mini Cart, Toast, Back to Top,
// Scroll Progress, Confetti, Recently Viewed, Exit Popup
// ============================================================

(function () {
  'use strict';

  /* ── 1. SCROLL PROGRESS BAR ─────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.id = 'sProgressBar';
  Object.assign(progressBar.style, {
    position: 'fixed', top: 0, left: 0, height: '3px',
    background: 'linear-gradient(90deg,#f3340c,#ff6b35,#f3340c)',
    backgroundSize: '200% 100%', animation: 'shimmer 2s infinite',
    zIndex: 99999, width: '0%', transition: 'width .1s',
    boxShadow: '0 0 8px rgba(243,52,12,.6)'
  });
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  });

  /* ── 2. BACK TO TOP ─────────────────────────────────────── */
  const btt = document.createElement('button');
  btt.id = 'sBackTop';
  btt.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btt.title = 'Back to top';
  Object.assign(btt.style, {
    position: 'fixed', bottom: '28px', right: '24px', zIndex: 9998,
    width: '46px', height: '46px', borderRadius: '50%',
    background: '#f3340c', color: 'white', border: 'none',
    fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(243,52,12,.4)',
    display: 'none', transition: 'all .3s', alignItems: 'center',
    justifyContent: 'center'
  });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  btt.addEventListener('mouseenter', () => btt.style.transform = 'scale(1.15) translateY(-3px)');
  btt.addEventListener('mouseleave', () => btt.style.transform = 'scale(1) translateY(0)');
  document.body.appendChild(btt);

  window.addEventListener('scroll', () => {
    btt.style.display = window.scrollY > 400 ? 'flex' : 'none';
  });

  /* ── 3. TOAST NOTIFICATION SYSTEM ───────────────────────── */
  const toastContainer = document.createElement('div');
  Object.assign(toastContainer.style, {
    position: 'fixed', top: '80px', right: '20px', zIndex: 99997,
    display: 'flex', flexDirection: 'column', gap: '10px',
    pointerEvents: 'none', maxWidth: '320px'
  });
  document.body.appendChild(toastContainer);

  window.showToast = function (msg, type = 'success', duration = 3000) {
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warn: 'fa-exclamation-circle' };
    const colors = { success: '#16a34a', error: '#e53e3e', info: '#3b82f6', warn: '#d97706' };
    const t = document.createElement('div');
    t.style.cssText = `
      background:white;border-left:4px solid ${colors[type]};border-radius:12px;
      padding:14px 16px;box-shadow:0 8px 30px rgba(0,0,0,.15);
      display:flex;align-items:center;gap:12px;pointer-events:all;
      font-family:'Barlow',sans-serif;font-size:14px;font-weight:600;color:#222;
      animation:toastIn .35s cubic-bezier(.175,.885,.32,1.275);
      min-width:240px;cursor:pointer;
    `;
    t.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]};font-size:18px;flex-shrink:0"></i><span>${msg}</span><i class="fas fa-times" style="color:#ccc;margin-left:auto;font-size:12px"></i>`;
    t.addEventListener('click', () => dismiss(t));
    toastContainer.appendChild(t);
    const timer = setTimeout(() => dismiss(t), duration);
    function dismiss(el) {
      clearTimeout(timer);
      el.style.animation = 'toastOut .25s ease forwards';
      setTimeout(() => el.remove(), 250);
    }
  };

  /* ── 4. LIVE SEARCH ─────────────────────────────────────── */
  let searchDebounce;
  function initLiveSearch() {
    const inp = document.getElementById('sSearchInput') || document.querySelector('.s-search-inp');
    if (!inp) return;
    const dropdown = document.createElement('div');
    dropdown.id = 'sSearchDrop';
    dropdown.style.cssText = `
      position:absolute;top:calc(100% + 6px);left:0;right:0;background:white;
      border-radius:14px;box-shadow:0 12px 40px rgba(0,0,0,.18);
      z-index:9996;max-height:400px;overflow-y:auto;display:none;
      font-family:'Barlow',sans-serif;border:1px solid #eee;
    `;
    inp.parentElement.style.position = 'relative';
    inp.parentElement.appendChild(dropdown);

    inp.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      const q = inp.value.trim();
      if (q.length < 2) { dropdown.style.display = 'none'; return; }
      dropdown.innerHTML = '<div style="padding:16px;text-align:center;color:#999"><i class="fas fa-spinner fa-spin"></i> Searching...</div>';
      dropdown.style.display = 'block';
      searchDebounce = setTimeout(async () => {
        try {
          const res = await Products.getAll({ search: q, limit: 6 });
          const items = res.products || res.data || [];
          if (!items.length) {
            dropdown.innerHTML = `<div style="padding:20px;text-align:center;color:#999"><i class="fas fa-search" style="font-size:28px;margin-bottom:8px;display:block;opacity:.3"></i>No results for "<strong>${q}</strong>"</div>`;
            return;
          }
          dropdown.innerHTML = `
            <div style="padding:10px 16px;font-size:11px;color:#999;font-weight:700;text-transform:uppercase;border-bottom:1px solid #f0f0f0">
              ${items.length} result${items.length > 1 ? 's' : ''} for "${q}"
            </div>
            ${items.map(p => `
              <a href="product-detail.html?id=${p._id || p.id}" style="display:flex;align-items:center;gap:12px;padding:12px 16px;text-decoration:none;color:#222;border-bottom:1px solid #f8f8f8;transition:background .15s" onmouseenter="this.style.background='#fff5f3'" onmouseleave="this.style.background='white'">
                <img src="${p.images?.[0] || ''}" onerror="this.src='https://placehold.co/44x44/f0f0f0/999?text=P'" style="width:44px;height:44px;object-fit:cover;border-radius:8px;flex-shrink:0"/>
                <div style="flex:1;min-width:0">
                  <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
                  <div style="font-size:11px;color:#999;margin-top:2px">${p.category || ''}</div>
                </div>
                <div style="font-weight:800;color:#f3340c;white-space:nowrap;font-size:14px">$${parseFloat(p.price||0).toFixed(2)}</div>
              </a>`).join('')}
            <a href="shop.html?search=${encodeURIComponent(q)}" style="display:block;text-align:center;padding:12px;color:#f3340c;font-weight:700;font-size:13px;background:#fff8f6;border-radius:0 0 14px 14px">View all results →</a>
          `;
        } catch { dropdown.style.display = 'none'; }
      }, 320);
    });

    document.addEventListener('click', e => { if (!inp.parentElement.contains(e.target)) dropdown.style.display = 'none'; });
    inp.addEventListener('keydown', e => { if (e.key === 'Escape') dropdown.style.display = 'none'; });
  }

  /* ── 5. MINI CART SLIDE-OUT ──────────────────────────────── */
  const miniCartOverlay = document.createElement('div');
  miniCartOverlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9990;display:none;backdrop-filter:blur(2px)';
  document.body.appendChild(miniCartOverlay);

  const miniCart = document.createElement('div');
  miniCart.id = 'sMiniCart';
  miniCart.style.cssText = `
    position:fixed;top:0;right:0;height:100vh;width:min(380px,100vw);
    background:white;z-index:9991;transform:translateX(100%);
    transition:transform .35s cubic-bezier(.4,0,.2,1);
    box-shadow:-8px 0 40px rgba(0,0,0,.15);display:flex;flex-direction:column;
    font-family:'Barlow',sans-serif;
  `;
  miniCart.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 20px 16px;border-bottom:1px solid #f0f0f0">
      <h3 style="font-size:18px;font-weight:900"><i class="fas fa-shopping-bag" style="color:#f3340c;margin-right:8px"></i>Your Cart</h3>
      <button id="sMiniClose" style="background:none;border:none;font-size:20px;cursor:pointer;color:#999;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center">✕</button>
    </div>
    <div id="sMiniItems" style="flex:1;overflow-y:auto;padding:16px"></div>
    <div style="padding:16px;border-top:1px solid #f0f0f0;background:#fafafa">
      <div style="display:flex;justify-content:space-between;font-size:16px;font-weight:800;margin-bottom:14px">
        <span>Total</span><span id="sMiniTotal" style="color:#f3340c">$0.00</span>
      </div>
      <a href="checkout.html" style="display:block;width:100%;padding:14px;background:#f3340c;color:white;text-align:center;border-radius:12px;font-weight:800;font-size:15px;text-decoration:none;margin-bottom:8px">
        <i class="fas fa-lock"></i> Checkout Securely
      </a>
      <a href="cart.html" style="display:block;width:100%;padding:11px;background:white;border:2px solid #e0e0e0;color:#333;text-align:center;border-radius:12px;font-weight:700;font-size:14px;text-decoration:none">
        View Full Cart
      </a>
    </div>
  `;
  document.body.appendChild(miniCart);

  function openMiniCart() {
    miniCart.style.transform = 'translateX(0)';
    miniCartOverlay.style.display = 'block';
    loadMiniCart();
    document.body.style.overflow = 'hidden';
  }
  function closeMiniCart() {
    miniCart.style.transform = 'translateX(100%)';
    miniCartOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }
  miniCartOverlay.addEventListener('click', closeMiniCart);
  document.getElementById('sMiniClose').addEventListener('click', closeMiniCart);

  async function loadMiniCart() {
    const container = document.getElementById('sMiniItems');
    container.innerHTML = '<div style="text-align:center;padding:30px;color:#999"><i class="fas fa-spinner fa-spin fa-2x"></i></div>';
    try {
      const cart = await Cart.get();
      const items = cart.items || [];
      if (!items.length) {
        container.innerHTML = `<div style="text-align:center;padding:40px 20px;color:#999">
          <i class="fas fa-shopping-cart" style="font-size:48px;opacity:.2;margin-bottom:12px;display:block"></i>
          <p style="font-weight:700">Your cart is empty</p>
          <a href="shop.html" style="color:#f3340c;font-weight:700;font-size:13px">Browse Products →</a>
        </div>`;
        document.getElementById('sMiniTotal').textContent = '$0.00';
        return;
      }
      container.innerHTML = items.map(i => `
        <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #f5f5f5">
          <img src="${i.image || ''}" onerror="this.src='https://placehold.co/56x56/f0f0f0/999?text=P'" style="width:56px;height:56px;object-fit:cover;border-radius:10px;flex-shrink:0"/>
          <div style="flex:1;min-width:0">
            <div style="font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.name}</div>
            <div style="font-size:12px;color:#999;margin-top:2px">Qty: ${i.quantity}</div>
            <div style="font-weight:800;color:#f3340c;margin-top:3px;font-size:14px">$${(i.price * i.quantity).toFixed(2)}</div>
          </div>
          <button onclick="removeFromMiniCart('${i.product_id}')" style="background:none;border:none;color:#ccc;cursor:pointer;font-size:16px;padding:4px;flex-shrink:0" title="Remove">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>`).join('');
      document.getElementById('sMiniTotal').textContent = '$' + parseFloat(cart.total).toFixed(2);
    } catch { container.innerHTML = '<div style="text-align:center;padding:30px;color:#999">Could not load cart</div>'; }
  }

  window.removeFromMiniCart = async function(id) {
    try { await Cart.remove(id); loadMiniCart(); showToast('Item removed from cart', 'info'); } catch {}
  };

  // Hook cart icon to open mini cart
  function hookCartIcon() {
    const cartBtns = document.querySelectorAll('.s-icon-btn[href="cart.html"], a[href="cart.html"].s-icon-btn');
    cartBtns.forEach(btn => {
      btn.addEventListener('click', e => { e.preventDefault(); openMiniCart(); });
    });
  }

  /* ── 6. RECENTLY VIEWED ─────────────────────────────────── */
  const RV_KEY = 'shopire_recently_viewed';
  window.trackRecentlyViewed = function(product) {
    let rv = JSON.parse(localStorage.getItem(RV_KEY) || '[]');
    rv = rv.filter(p => p.id !== (product._id || product.id));
    rv.unshift({ id: product._id || product.id, name: product.name, price: product.price, image: product.images?.[0] || '' });
    localStorage.setItem(RV_KEY, JSON.stringify(rv.slice(0, 8)));
  };

  window.renderRecentlyViewed = function(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const rv = JSON.parse(localStorage.getItem(RV_KEY) || '[]');
    if (!rv.length) { el.closest?.('.rv-section')?.remove(); return; }
    el.innerHTML = rv.map(p => `
      <a href="product-detail.html?id=${p.id}" style="display:block;text-decoration:none;color:inherit;background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.07);transition:.2s" onmouseenter="this.style.transform='translateY(-4px)'" onmouseleave="this.style.transform='none'">
        <img src="${p.image}" onerror="this.src='https://placehold.co/180x180/f0f0f0/999?text=P'" style="width:100%;height:120px;object-fit:cover"/>
        <div style="padding:10px 12px">
          <div style="font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${p.name}</div>
          <div style="color:#f3340c;font-weight:800;font-size:14px;margin-top:4px">$${parseFloat(p.price||0).toFixed(2)}</div>
        </div>
      </a>`).join('');
  };

  /* ── 7. EXIT INTENT NEWSLETTER POPUP ────────────────────── */
  let exitShown = false;
  const EXIT_KEY = 'shopire_exit_shown';

  function showExitPopup() {
    if (exitShown || localStorage.getItem(EXIT_KEY)) return;
    exitShown = true;
    localStorage.setItem(EXIT_KEY, '1');
    const popup = document.createElement('div');
    popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:99995;display:flex;align-items:center;justify-content:center;padding:20px;animation:fadeIn .3s ease';
    popup.innerHTML = `
      <div style="background:white;border-radius:24px;max-width:440px;width:100%;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.3);position:relative;animation:slideUp .4s cubic-bezier(.175,.885,.32,1.275)">
        <div style="background:linear-gradient(135deg,#f3340c,#ff6b35);padding:36px 32px 28px;text-align:center;color:white">
          <div style="font-size:48px;margin-bottom:8px">🎁</div>
          <h2 style="font-family:'Barlow Condensed',sans-serif;font-size:32px;font-weight:900;margin-bottom:6px">WAIT! Don't Leave Yet</h2>
          <p style="font-size:15px;opacity:.9">Get <strong>20% OFF</strong> your first order</p>
        </div>
        <div style="padding:28px 32px">
          <p style="color:#555;font-size:14px;margin-bottom:18px;text-align:center">Subscribe to unlock exclusive deals, flash sales & new arrivals!</p>
          <div style="display:flex;gap:8px;margin-bottom:14px">
            <input id="exitEmail" type="email" placeholder="your@email.com" style="flex:1;padding:12px 16px;border:2px solid #e0e0e0;border-radius:10px;font-family:'Barlow',sans-serif;font-size:14px;outline:none"/>
            <button onclick="subscribeExit()" style="padding:12px 18px;background:#f3340c;color:white;border:none;border-radius:10px;font-weight:800;font-size:14px;cursor:pointer;white-space:nowrap;font-family:'Barlow',sans-serif">Get 20% OFF</button>
          </div>
          <p style="text-align:center;font-size:12px;color:#aaa">🔒 No spam ever. Unsubscribe anytime.</p>
          <button onclick="this.closest('[style*=\"inset:0\"]').remove()" style="display:block;margin:14px auto 0;background:none;border:none;color:#aaa;cursor:pointer;font-size:13px;font-family:'Barlow',sans-serif">No thanks, I don't want 20% off</button>
        </div>
        <button onclick="this.closest('[style*=\"inset:0\"]').remove()" style="position:absolute;top:12px;right:16px;background:rgba(255,255,255,.3);border:none;color:white;font-size:18px;cursor:pointer;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center">✕</button>
      </div>`;
    document.body.appendChild(popup);
  }

  window.subscribeExit = function() {
    const email = document.getElementById('exitEmail')?.value?.trim();
    if (!email || !email.includes('@')) { showToast('Please enter a valid email', 'error'); return; }
    document.querySelector('[style*="inset:0"][style*="99995"]')?.remove();
    showToast('🎉 You\'re subscribed! Use code SAVE20 at checkout', 'success', 5000);
  };

  // Trigger on mouse leaving the window (exit intent)
  document.addEventListener('mouseleave', e => { if (e.clientY < 20) showExitPopup(); });
  // Fallback: show after 45s
  setTimeout(() => showExitPopup(), 45000);

  /* ── 8. ADD-TO-CART SUCCESS ANIMATION ───────────────────── */
  window.cartSuccessAnim = function(btn) {
    if (!btn) return;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added!';
    btn.style.background = '#16a34a';
    setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 1800);
  };

  /* ── CSS INJECTIONS ─────────────────────────────────────── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
    @keyframes toastIn { from{transform:translateX(110%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes toastOut { to{transform:translateX(110%);opacity:0} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes slideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
    #sMiniCart { font-family: 'Barlow', sans-serif !important; }
    #sSearchDrop::-webkit-scrollbar { width:6px }
    #sSearchDrop::-webkit-scrollbar-thumb { background:#e0e0e0;border-radius:3px }
    #sMiniItems::-webkit-scrollbar { width:5px }
    #sMiniItems::-webkit-scrollbar-thumb { background:#e0e0e0;border-radius:3px }
  `;
  document.head.appendChild(style);

  /* ── INIT ───────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initLiveSearch();
    hookCartIcon();
  });

  // Also try after nav injection (nav uses setTimeout internally)
  setTimeout(() => { initLiveSearch(); hookCartIcon(); }, 600);

})();
