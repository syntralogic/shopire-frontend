/* =====================================================
   SHOPIRE — Shared Navigation System
   Inject this script into every page via <script src="shopire-nav.js">
   ===================================================== */

(function () {
  /* ── helpers ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';

  function isActive(href) {
    return currentPage === href ? 'active' : '';
  }

  /* ── Shared CSS ── */
  const css = `
    :root {
      --red: #f3340c;
      --red-dark: #d42a08;
      --black: #111111;
      --dark: #1a1a1a;
      --gray: #f5f5f5;
      --gray2: #e8e8e8;
      --text: #333;
      --muted: #777;
      --white: #ffffff;
      --nav-h: 68px;
    }

    /* ── ANNOUNCEMENT BAR ── */
    .s-announce {
      background: var(--red);
      color: white;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      padding: 8px 16px;
      letter-spacing: .3px;
      position: relative;
      overflow: hidden;
    }
    .s-announce::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg,transparent 0%,rgba(255,255,255,.12) 50%,transparent 100%);
      animation: shimmer 3s infinite;
    }
    @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
    .s-announce a { color: white; text-decoration: underline; margin-left: 8px; }
    .s-announce-close {
      position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: white; cursor: pointer; font-size: 16px; line-height: 1; z-index: 2;
    }

    /* ── TOP BAR ── */
    .s-topbar {
      background: var(--black);
      color: white;
      font-size: 12.5px;
      padding: 7px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .s-topbar-left { display: flex; align-items: center; gap: 18px; }
    .s-topbar-left a { color: #bbb; display: flex; align-items: center; gap: 5px; transition: color .2s; }
    .s-topbar-left a i { color: var(--red); font-size: 11px; }
    .s-topbar-left a:hover { color: white; }
    .s-topbar-center { color: #bbb; font-size: 12px; }
    .s-topbar-center strong { color: var(--red); }
    .s-topbar-right { display: flex; align-items: center; gap: 16px; }
    .s-topbar-right a { color: #bbb; font-size: 12px; transition: color .2s; }
    .s-topbar-right a:hover { color: white; }
    .s-topbar-right .sep { color: #444; }
    .s-topbar-lang { display: flex; align-items: center; gap: 6px; color: #bbb; cursor: pointer; }
    .s-topbar-lang select { background: transparent; border: none; outline: none; color: #bbb; font-size: 12px; cursor: pointer; font-family: inherit; }

    /* ── MAIN NAVBAR ── */
    .s-nav {
      background: white;
      padding: 0 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      box-shadow: 0 2px 20px rgba(0,0,0,.09);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: var(--nav-h);
      transition: box-shadow .3s;
    }
    .s-nav.scrolled { box-shadow: 0 4px 30px rgba(0,0,0,.15); }

    /* Logo */
    .s-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -1px;
      color: var(--black);
      text-decoration: none;
      flex-shrink: 0;
    }
    .s-logo-icon {
      background: var(--red);
      color: white;
      width: 38px; height: 38px;
      border-radius: 9px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    /* Nav links */
    .s-nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 100%;
      list-style: none;
      margin: 0; padding: 0;
    }
    .s-nav-links > li {
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;
    }
    .s-nav-links > li > a,
    .s-nav-links > li > .s-nav-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 14px;
      height: 100%;
      font-weight: 700;
      font-size: 14.5px;
      color: var(--text);
      transition: color .2s;
      text-decoration: none;
      white-space: nowrap;
      background: none;
      border: none;
      cursor: pointer;
      font-family: inherit;
      position: relative;
    }
    .s-nav-links > li > a::after,
    .s-nav-links > li > .s-nav-btn::after {
      content: '';
      position: absolute;
      bottom: 0; left: 50%; right: 50%;
      height: 3px;
      background: var(--red);
      border-radius: 3px 3px 0 0;
      transition: left .25s, right .25s;
    }
    .s-nav-links > li > a:hover,
    .s-nav-links > li > .s-nav-btn:hover,
    .s-nav-links > li.open > .s-nav-btn { color: var(--red); }
    .s-nav-links > li > a:hover::after,
    .s-nav-links > li > .s-nav-btn:hover::after,
    .s-nav-links > li.open > .s-nav-btn::after,
    .s-nav-links > li > a.active::after { left: 14px; right: 14px; }
    .s-nav-links > li > a.active { color: var(--red); }
    .s-nav-chevron { font-size: 11px; transition: transform .25s; }
    .s-nav-links > li.open .s-nav-chevron { transform: rotate(180deg); }

    /* ── MEGA MENU ── */
    .s-mega {
      position: absolute;
      top: calc(100% + 0px);
      left: -20px;
      background: white;
      border-radius: 0 0 16px 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,.15);
      padding: 28px 28px 24px;
      min-width: 700px;
      display: none;
      border-top: 3px solid var(--red);
      animation: megaIn .2s ease;
      z-index: 200;
    }
    @keyframes megaIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    .s-nav-links > li.open .s-mega { display: block; }
    .s-mega-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .s-mega-col h4 {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--muted);
      padding: 0 10px 8px;
      border-bottom: 1px solid var(--gray2);
      margin-bottom: 6px;
    }
    .s-mega-col a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 7px 10px;
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 600;
      color: var(--text);
      transition: background .15s, color .15s;
      text-decoration: none;
    }
    .s-mega-col a .s-mega-icon {
      width: 30px; height: 30px;
      background: var(--gray);
      border-radius: 7px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      transition: background .15s;
    }
    .s-mega-col a:hover { background: #fff3f0; color: var(--red); }
    .s-mega-col a:hover .s-mega-icon { background: #ffd0c5; }
    .s-mega-promo {
      margin-top: 20px;
      background: linear-gradient(135deg, var(--black), #1a1a2e);
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .s-mega-promo p { color: #aaa; font-size: 12px; margin-bottom: 4px; }
    .s-mega-promo strong { color: white; font-size: 16px; font-weight: 800; }
    .s-mega-promo a {
      background: var(--red); color: white;
      padding: 8px 18px; border-radius: 50px;
      font-size: 13px; font-weight: 700;
      text-decoration: none;
      transition: background .2s;
    }
    .s-mega-promo a:hover { background: var(--red-dark); }

    /* Simple dropdown */
    .s-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: white;
      border-radius: 0 0 12px 12px;
      box-shadow: 0 16px 40px rgba(0,0,0,.13);
      padding: 10px 0;
      min-width: 220px;
      display: none;
      border-top: 3px solid var(--red);
      animation: megaIn .2s ease;
      z-index: 200;
    }
    .s-nav-links > li.open .s-dropdown { display: block; }
    .s-dropdown a {
      display: flex; align-items: center; gap: 10px;
      padding: 9px 20px;
      font-size: 14px; font-weight: 600;
      color: var(--text); text-decoration: none;
      transition: background .15s, color .15s;
    }
    .s-dropdown a:hover { background: #fff3f0; color: var(--red); }
    .s-dropdown a i { width: 16px; color: var(--red); }

    /* Right icons */
    .s-nav-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .s-icon-btn {
      position: relative;
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      font-size: 17px;
      color: var(--text);
      text-decoration: none;
      transition: background .15s, color .15s;
      background: none;
      border: none;
      cursor: pointer;
    }
    .s-icon-btn:hover { background: var(--gray); color: var(--red); }
    .s-icon-badge {
      position: absolute;
      top: 4px; right: 4px;
      background: var(--red);
      color: white;
      font-size: 9px;
      min-width: 16px; height: 16px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800;
      padding: 0 3px;
    }
    .s-btn-shop {
      background: var(--red);
      color: white !important;
      padding: 10px 20px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      transition: background .2s, transform .15s;
      white-space: nowrap;
      margin-left: 8px;
    }
    .s-btn-shop:hover { background: var(--red-dark) !important; transform: translateY(-1px); }

    /* ── SEARCH BAR (below nav) ── */
    .s-searchbar {
      background: var(--gray);
      padding: 12px 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 28px;
      border-bottom: 1px solid var(--gray2);
    }
    .s-browse-wrap { position: relative; }
    .s-browse-btn {
      background: var(--red);
      color: white;
      padding: 11px 18px;
      border-radius: 7px;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 210px;
      cursor: pointer;
      justify-content: space-between;
      border: none;
      font-family: inherit;
    }
    .s-browse-btn i:last-child { transition: transform .25s; }
    .s-browse-btn.open i:last-child { transform: rotate(180deg); }
    .s-browse-dd {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      background: white;
      border: 1px solid var(--gray2);
      border-radius: 10px;
      box-shadow: 0 16px 40px rgba(0,0,0,.12);
      min-width: 240px;
      padding: 8px 0;
      display: none;
      z-index: 500;
      animation: megaIn .18s ease;
    }
    .s-browse-dd.open { display: block; }
    .s-browse-dd a {
      display: flex; align-items: center; gap: 12px;
      padding: 9px 18px;
      font-size: 13.5px; font-weight: 600;
      color: var(--text); text-decoration: none;
      transition: background .15s, color .15s;
    }
    .s-browse-dd a i { width: 18px; text-align: center; color: var(--red); }
    .s-browse-dd a:hover { background: #fff3f0; color: var(--red); }
    .s-browse-dd .browse-sep { height: 1px; background: var(--gray2); margin: 6px 0; }
    .s-search-form {
      flex: 1;
      display: flex;
      border: 2px solid var(--gray2);
      border-radius: 8px;
      overflow: hidden;
      background: white;
      transition: border-color .2s;
    }
    .s-search-form:focus-within { border-color: var(--red); }
    .s-search-form input {
      flex: 1;
      padding: 11px 16px;
      border: none;
      outline: none;
      font-size: 14px;
      font-family: 'Barlow', sans-serif;
      color: var(--text);
    }
    .s-search-form select {
      border: none;
      border-left: 1px solid var(--gray2);
      padding: 0 14px;
      outline: none;
      font-size: 13px;
      background: white;
      font-family: 'Barlow', sans-serif;
      color: var(--text);
      cursor: pointer;
    }
    .s-search-form button {
      background: var(--red);
      color: white;
      border: none;
      padding: 0 22px;
      cursor: pointer;
      font-size: 16px;
      transition: background .2s;
      font-family: inherit;
    }
    .s-search-form button:hover { background: var(--red-dark); }
    .s-contact-box {
      display: flex; align-items: center; gap: 12px;
      min-width: 200px;
    }
    .s-contact-box i { font-size: 28px; color: var(--red); }
    .s-contact-box span { font-size: 11px; color: var(--muted); display: block; margin-bottom: 2px; }
    .s-contact-box strong { font-size: 15px; color: var(--text); }

    /* ── MOBILE MENU ── */
    .s-hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 6px;
      background: none;
      border: none;
    }
    .s-hamburger span {
      display: block;
      width: 22px; height: 2px;
      background: var(--text);
      border-radius: 2px;
      transition: all .3s;
    }
    .s-mobile-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      z-index: 1998;
    }
    .s-mobile-overlay.open { display: block; }
    .s-mobile-menu {
      position: fixed;
      top: 0; left: -100%;
      width: 310px; height: 100vh;
      background: white;
      z-index: 1999;
      overflow-y: auto;
      transition: left .35s cubic-bezier(.4,0,.2,1);
      padding-bottom: 40px;
    }
    .s-mobile-menu.open { left: 0; }
    .s-mobile-header {
      background: var(--black);
      padding: 18px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .s-mobile-header .s-logo { color: white; }
    .s-mobile-close {
      background: none; border: none; color: white; font-size: 20px; cursor: pointer;
    }
    .s-mobile-search {
      padding: 14px 16px;
      border-bottom: 1px solid var(--gray2);
      display: flex;
      background: var(--gray);
    }
    .s-mobile-search input {
      flex: 1; padding: 10px 14px;
      border: 1px solid var(--gray2); border-right: none;
      border-radius: 7px 0 0 7px;
      outline: none; font-family: inherit; font-size: 14px;
    }
    .s-mobile-search button {
      background: var(--red); color: white;
      border: none; padding: 0 16px;
      border-radius: 0 7px 7px 0;
      cursor: pointer;
    }
    .s-mobile-nav { padding: 10px 0; }
    .s-mobile-nav a {
      display: flex; align-items: center; gap: 12px;
      padding: 13px 20px;
      font-size: 15px; font-weight: 700;
      color: var(--text); text-decoration: none;
      border-bottom: 1px solid var(--gray);
      transition: color .2s, background .15s;
    }
    .s-mobile-nav a i { width: 20px; text-align: center; color: var(--red); }
    .s-mobile-nav a:hover, .s-mobile-nav a.active { color: var(--red); background: #fff3f0; }
    .s-mobile-section-title {
      padding: 16px 20px 8px;
      font-size: 11px; font-weight: 800;
      text-transform: uppercase; letter-spacing: 1px;
      color: var(--muted);
    }
    .s-mobile-cat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1px;
      background: var(--gray2);
      border-top: 1px solid var(--gray2);
      border-bottom: 1px solid var(--gray2);
    }
    .s-mobile-cat-grid a {
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      padding: 16px 8px;
      font-size: 12px; font-weight: 700;
      color: var(--text); text-decoration: none;
      background: white;
      transition: background .15s, color .15s;
      text-align: center;
      border: none;
    }
    .s-mobile-cat-grid a i { font-size: 22px; color: var(--red); }
    .s-mobile-cat-grid a:hover { background: #fff3f0; color: var(--red); }
    .s-mobile-bottom {
      padding: 16px 20px;
      display: flex; flex-direction: column; gap: 10px;
    }
    .s-mobile-btn-full {
      display: block; text-align: center;
      padding: 13px; border-radius: 10px;
      font-weight: 700; font-size: 15px;
      text-decoration: none;
      transition: all .2s;
    }
    .s-mobile-btn-red { background: var(--red); color: white; }
    .s-mobile-btn-red:hover { background: var(--red-dark); }
    .s-mobile-btn-outline { border: 2px solid var(--gray2); color: var(--text); }
    .s-mobile-btn-outline:hover { border-color: var(--red); color: var(--red); }

    /* ── DARK MODE ── */
    [data-theme="dark"] .s-nav { background: #1a1a1a !important; box-shadow: 0 2px 20px rgba(0,0,0,.4); }
    [data-theme="dark"] .s-logo { color: #f0f0f0 !important; }
    [data-theme="dark"] .s-nav-links > li > a,
    [data-theme="dark"] .s-nav-links > li > .s-nav-btn { color: #ccc !important; }
    [data-theme="dark"] .s-nav-links > li > a:hover,
    [data-theme="dark"] .s-nav-links > li > .s-nav-btn:hover,
    [data-theme="dark"] .s-nav-links > li > a.active { color: var(--red) !important; }
    [data-theme="dark"] .s-icon-btn { color: #ccc !important; }
    [data-theme="dark"] .s-icon-btn:hover { background: #2a2a2a !important; color: var(--red) !important; }
    [data-theme="dark"] .s-topbar { background: #0d0d0d !important; }
    [data-theme="dark"] .s-searchbar { background: #1a1a1a !important; border-color: #333 !important; }
    [data-theme="dark"] .s-search-form { background: #2a2a2a !important; border-color: #444 !important; }
    [data-theme="dark"] .s-search-form input { background: #2a2a2a !important; color: #e0e0e0 !important; }
    [data-theme="dark"] .s-search-form select { background: #2a2a2a !important; color: #e0e0e0 !important; border-color: #444 !important; }
    [data-theme="dark"] .s-mega { background: #1e1e1e !important; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    [data-theme="dark"] .s-mega-col h4 { color: #888 !important; border-color: #333 !important; }
    [data-theme="dark"] .s-mega-col a { color: #ccc !important; }
    [data-theme="dark"] .s-mega-col a:hover { background: #2a2a2a !important; color: var(--red) !important; }
    [data-theme="dark"] .s-mega-col a .s-mega-icon { background: #2a2a2a !important; }
    [data-theme="dark"] .s-dropdown { background: #1e1e1e !important; }
    [data-theme="dark"] .s-dropdown a { color: #ccc !important; }
    [data-theme="dark"] .s-dropdown a:hover { background: #2a2a2a !important; color: var(--red) !important; }
    [data-theme="dark"] .s-browse-dd { background: #1e1e1e !important; border-color: #333 !important; }
    [data-theme="dark"] .s-browse-dd a { color: #ccc !important; }
    [data-theme="dark"] .s-browse-dd a:hover { background: #2a2a2a !important; color: var(--red) !important; }
    [data-theme="dark"] .s-contact-box strong { color: #e0e0e0 !important; }
    [data-theme="dark"] .s-mobile-menu { background: #1a1a1a !important; }
    [data-theme="dark"] .s-mobile-nav a { color: #ccc !important; border-color: #2a2a2a !important; }
    [data-theme="dark"] .s-mobile-nav a:hover { background: #2a2a2a !important; color: var(--red) !important; }
    [data-theme="dark"] .s-mobile-search { background: #222 !important; border-color: #333 !important; }
    [data-theme="dark"] .s-mobile-search input { background: #2a2a2a !important; color: #e0e0e0 !important; border-color: #444 !important; }
    [data-theme="dark"] .s-mobile-cat-grid { background: #333 !important; }
    [data-theme="dark"] .s-mobile-cat-grid a { background: #1e1e1e !important; color: #ccc !important; }
    [data-theme="dark"] .s-mobile-cat-grid a:hover { background: #2a2a2a !important; color: var(--red) !important; }
    [data-theme="dark"] .s-mobile-btn-outline { border-color: #444 !important; color: #ccc !important; }
    [data-theme="dark"] .s-hamburger span { background: #ccc !important; }

    /* ── RESPONSIVE ── */
    @media (max-width: 1100px) {
      .s-nav-links { gap: 0; }
      .s-nav-links > li > a,
      .s-nav-links > li > .s-nav-btn { padding: 0 10px; font-size: 13.5px; }
    }
    @media (max-width: 900px) {
      .s-topbar { display: none; }
      .s-nav-links, .s-btn-shop { display: none; }
      .s-hamburger { display: flex; }
      .s-searchbar { padding: 10px 16px; gap: 10px; }
      .s-browse-wrap, .s-contact-box { display: none; }
      .s-nav { padding: 0 12px; }
      .s-nav-right { gap: 2px; }
      #sDarkToggleBtn { display: none; }
    }
    @media (max-width: 600px) {
      .s-searchbar { display: none; }
      .s-icon-btn { width: 34px; height: 34px; font-size: 15px; }
    }
  `;

  /* ── Inject styles ── */
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ── Build HTML ── */
  const html = `
    <!-- Announcement Bar -->
    <div class="s-announce" id="sAnnounce">
      🔥 <strong>FLASH SALE:</strong> Up to 50% OFF on all Electronics — Today only!
      <a href="shop.html">Shop Now →</a>
      <button class="s-announce-close" onclick="document.getElementById('sAnnounce').style.display='none'">&times;</button>
    </div>

    <!-- Top Bar -->
    <div class="s-topbar">
      <div class="s-topbar-left">
        <a href="tel:+8898006802"><i class="fas fa-phone-alt"></i> +88 (9800) 6802</a>
        <a href="mailto:support@shopire.com"><i class="fas fa-envelope"></i> support@shopire.com</a>
        <a href="#"><i class="fas fa-map-marker-alt"></i> Find a Store</a>
      </div>
      <div class="s-topbar-center">
        <span>Free shipping on orders over <strong>$49</strong> &nbsp;|&nbsp; 30-Day Returns &nbsp;|&nbsp; Secure Checkout</span>
      </div>
      <div class="s-topbar-right">
        <a href="#">Track Order</a>
        <span class="sep">|</span>
        <a href="#">My Account</a>
        <span class="sep">|</span>
        <div class="s-topbar-lang">
          <i class="fas fa-globe"></i>
          <select>
            <option>English (US)</option>
            <option>Urdu</option>
            <option>French</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Navbar -->
    <nav class="s-nav" id="sNav">
      <a href="index.html" class="s-logo">
        <div class="s-logo-icon"><i class="fas fa-bolt"></i></div>
        SHOPIRE
      </a>

      <ul class="s-nav-links" id="sNavLinks">

        <li>
          <a href="index.html" class="${isActive('index.html')}">Home</a>
        </li>

        <li id="shopMegaLi">
          <button class="s-nav-btn" onclick="toggleMega('shopMegaLi')">
            Shop <i class="fas fa-chevron-down s-nav-chevron"></i>
          </button>
          <div class="s-mega">
            <div class="s-mega-grid">
              <div class="s-mega-col">
                <h4>Computers</h4>
                <a href="category-laptops.html"><span class="s-mega-icon"><i class="fas fa-laptop"></i></span> Laptops</a>
                <a href="category-monitors.html"><span class="s-mega-icon"><i class="fas fa-desktop"></i></span> Monitors</a>
                <a href="category-tablets.html"><span class="s-mega-icon"><i class="fas fa-tablet-alt"></i></span> Tablets</a>
              </div>
              <div class="s-mega-col">
                <h4>Audio & Mobile</h4>
                <a href="category-smartphones.html"><span class="s-mega-icon"><i class="fas fa-mobile-alt"></i></span> Smartphones</a>
                <a href="category-headphones.html"><span class="s-mega-icon"><i class="fas fa-headphones"></i></span> Headphones</a>
                <a href="category-audio.html"><span class="s-mega-icon"><i class="fas fa-volume-up"></i></span> Audio / Speakers</a>
              </div>
              <div class="s-mega-col">
                <h4>Lifestyle</h4>
                <a href="category-cameras.html"><span class="s-mega-icon"><i class="fas fa-camera"></i></span> Cameras</a>
                <a href="category-wearables.html"><span class="s-mega-icon"><i class="fas fa-watch"></i></span> Wearables</a>
                <a href="category-furniture.html"><span class="s-mega-icon"><i class="fas fa-couch"></i></span> Furniture</a>
              </div>
              <div class="s-mega-col">
                <h4>Gaming</h4>
                <a href="category-gaming.html"><span class="s-mega-icon"><i class="fas fa-gamepad"></i></span> Gaming</a>
                <a href="shop.html"><span class="s-mega-icon"><i class="fas fa-fire"></i></span> All Products</a>
                <a href="shop.html?filter=new"><span class="s-mega-icon"><i class="fas fa-tags"></i></span> New Arrivals</a>
              </div>
            </div>
            <div class="s-mega-promo">
              <div>
                <p>Limited Time Offer</p>
                <strong>⚡ Up to 50% OFF — Gaming Week</strong>
              </div>
              <a href="category-gaming.html">Grab Deal →</a>
            </div>
          </div>
        </li>

        <li>
          <a href="shop.html" class="${isActive('shop.html')}">All Products</a>
        </li>

        <li id="catDdLi">
          <button class="s-nav-btn" onclick="toggleMega('catDdLi')">
            Categories <i class="fas fa-chevron-down s-nav-chevron"></i>
          </button>
          <div class="s-dropdown">
            <a href="category-smartphones.html"><i class="fas fa-mobile-alt"></i> Smartphones</a>
            <a href="category-laptops.html"><i class="fas fa-laptop"></i> Laptops</a>
            <a href="category-tablets.html"><i class="fas fa-tablet-alt"></i> Tablets</a>
            <a href="category-headphones.html"><i class="fas fa-headphones"></i> Headphones</a>
            <a href="category-audio.html"><i class="fas fa-volume-up"></i> Audio</a>
            <a href="category-cameras.html"><i class="fas fa-camera"></i> Cameras</a>
            <a href="category-gaming.html"><i class="fas fa-gamepad"></i> Gaming</a>
            <a href="category-wearables.html"><i class="fas fa-watch"></i> Wearables</a>
            <a href="category-monitors.html"><i class="fas fa-desktop"></i> Monitors</a>
            <a href="category-furniture.html"><i class="fas fa-couch"></i> Furniture</a>
          </div>
        </li>

        <li>
          <a href="blog.html" class="${isActive('blog.html')}">Blog</a>
        </li>

        <li>
          <a href="contact.html" class="${isActive('contact.html')}">Contact</a>
        </li>

      </ul>

      <div class="s-nav-right">
        <button class="s-icon-btn" onclick="toggleSearch()" title="Search">
          <i class="fas fa-search"></i>
        </button>
        <a href="#" class="s-icon-btn" title="Wishlist">
          <i class="far fa-heart"></i>
          <span class="s-icon-badge">3</span>
        </a>
        <a href="cart.html" class="s-icon-btn" title="Cart">
          <i class="fas fa-shopping-bag"></i>
          <span class="s-icon-badge" id="cartCount">0</span>
        </a>
        <a href="#" class="s-icon-btn" title="Account">
          <i class="far fa-user"></i>
        </a>
        <button class="s-icon-btn" id="sDarkToggleBtn" onclick="toggleDarkMode()" title="Toggle Dark Mode" style="font-size:17px;">
          <i id="sDarkIcon" class="fas fa-moon"></i>
        </button>
        <a href="shop.html" class="s-btn-shop">
          <i class="fas fa-bolt"></i> Shop Now
        </a>
        <button class="s-hamburger" id="sHamburger" onclick="openMobileMenu()" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- Search Bar -->
    <div class="s-searchbar" id="sSearchbar">
      <div class="s-browse-wrap">
        <button class="s-browse-btn" id="sBrowseBtn" onclick="toggleBrowse()">
          <span><i class="fas fa-th-large" style="margin-right:6px"></i> Browse Categories</span>
          <i class="fas fa-chevron-down"></i>
        </button>
        <div class="s-browse-dd" id="sBrowseDd">
          <a href="category-smartphones.html"><i class="fas fa-mobile-alt"></i> Smartphones</a>
          <a href="category-laptops.html"><i class="fas fa-laptop"></i> Laptops</a>
          <a href="category-tablets.html"><i class="fas fa-tablet-alt"></i> Tablets</a>
          <a href="category-headphones.html"><i class="fas fa-headphones"></i> Headphones</a>
          <a href="category-audio.html"><i class="fas fa-volume-up"></i> Audio & Speakers</a>
          <a href="category-cameras.html"><i class="fas fa-camera"></i> Cameras</a>
          <a href="category-gaming.html"><i class="fas fa-gamepad"></i> Gaming</a>
          <a href="category-wearables.html"><i class="fas fa-watch"></i> Wearables</a>
          <a href="category-monitors.html"><i class="fas fa-desktop"></i> Monitors</a>
          <a href="category-furniture.html"><i class="fas fa-couch"></i> Furniture</a>
          <div class="browse-sep"></div>
          <a href="shop.html"><i class="fas fa-th"></i> All Products</a>
        </div>
      </div>

      <div class="s-search-form">
        <input type="text" id="sSearchInput" placeholder="Search for products, brands, categories..." />
        <select>
          <option>All Categories</option>
          <option>Smartphones</option>
          <option>Laptops</option>
          <option>Tablets</option>
          <option>Audio</option>
          <option>Cameras</option>
          <option>Gaming</option>
          <option>Wearables</option>
        </select>
        <button><i class="fas fa-search"></i></button>
      </div>

      <div class="s-contact-box">
        <i class="fas fa-headset"></i>
        <div>
          <span>Customer Support</span>
          <strong>+88 (9800) 6802</strong>
        </div>
      </div>
    </div>

    <!-- Mobile Overlay -->
    <div class="s-mobile-overlay" id="sMobileOverlay" onclick="closeMobileMenu()"></div>

    <!-- Mobile Menu -->
    <div class="s-mobile-menu" id="sMobileMenu">
      <div class="s-mobile-header">
        <a href="index.html" class="s-logo">
          <div class="s-logo-icon"><i class="fas fa-bolt"></i></div>
          SHOPIRE
        </a>
        <button class="s-mobile-close" onclick="closeMobileMenu()">&times;</button>
      </div>
      <div class="s-mobile-search">
        <input type="text" placeholder="Search products...">
        <button><i class="fas fa-search"></i></button>
      </div>
      <div class="s-mobile-nav">
        <a href="index.html" class="${isActive('index.html')}"><i class="fas fa-home"></i> Home</a>
        <a href="shop.html" class="${isActive('shop.html')}"><i class="fas fa-store"></i> All Products</a>
        <a href="blog.html" class="${isActive('blog.html')}"><i class="fas fa-blog"></i> Blog</a>
        <a href="contact.html" class="${isActive('contact.html')}"><i class="fas fa-envelope"></i> Contact</a>
        <a href="cart.html" class="${isActive('cart.html')}"><i class="fas fa-shopping-bag"></i> Cart <span style="margin-left:auto;background:var(--red);color:white;font-size:11px;padding:2px 8px;border-radius:50px;" id="mobileCartCount">0</span></a>
      </div>
      <div class="s-mobile-section-title">Categories</div>
      <div class="s-mobile-cat-grid">
        <a href="category-smartphones.html"><i class="fas fa-mobile-alt"></i>Smartphones</a>
        <a href="category-laptops.html"><i class="fas fa-laptop"></i>Laptops</a>
        <a href="category-tablets.html"><i class="fas fa-tablet-alt"></i>Tablets</a>
        <a href="category-headphones.html"><i class="fas fa-headphones"></i>Headphones</a>
        <a href="category-audio.html"><i class="fas fa-volume-up"></i>Audio</a>
        <a href="category-cameras.html"><i class="fas fa-camera"></i>Cameras</a>
        <a href="category-gaming.html"><i class="fas fa-gamepad"></i>Gaming</a>
        <a href="category-wearables.html"><i class="fas fa-watch"></i>Wearables</a>
        <a href="category-monitors.html"><i class="fas fa-desktop"></i>Monitors</a>
        <a href="category-furniture.html"><i class="fas fa-couch"></i>Furniture</a>
      </div>
      <div class="s-mobile-bottom" id="sMobileBottom">
        <a href="shop.html" class="s-mobile-btn-full s-mobile-btn-red"><i class="fas fa-bolt"></i> Shop Now</a>
        <div id="sMobileAuthBtns"></div>
      </div>
    </div>
  `;

  /* ── Inject into DOM ── */
  const container = document.createElement('div');
  container.id = 'shopire-nav';
  container.innerHTML = html;

  const body = document.body;
  body.insertBefore(container, body.firstChild);

  /* ── Interaction logic ── */

  // Navbar scroll effect
  const sNav = document.getElementById('sNav');
  window.addEventListener('scroll', () => {
    sNav.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Mega / dropdown toggle
  window.toggleMega = function (liId) {
    const li = document.getElementById(liId);
    const isOpen = li.classList.contains('open');
    // Close all
    document.querySelectorAll('.s-nav-links > li.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) li.classList.add('open');
  };

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#sNavLinks') && !e.target.closest('#sBrowseBtn') && !e.target.closest('#sBrowseDd')) {
      document.querySelectorAll('.s-nav-links > li.open').forEach(el => el.classList.remove('open'));
      const bd = document.getElementById('sBrowseDd');
      const bb = document.getElementById('sBrowseBtn');
      if (bd) { bd.classList.remove('open'); bb.classList.remove('open'); }
    }
  });

  // Browse dropdown
  window.toggleBrowse = function () {
    const dd = document.getElementById('sBrowseDd');
    const btn = document.getElementById('sBrowseBtn');
    dd.classList.toggle('open');
    btn.classList.toggle('open');
  };

  // Mobile menu
  window.openMobileMenu = function () {
    document.getElementById('sMobileMenu').classList.add('open');
    document.getElementById('sMobileOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeMobileMenu = function () {
    document.getElementById('sMobileMenu').classList.remove('open');
    document.getElementById('sMobileOverlay').classList.remove('open');
    document.body.style.overflow = '';
  };

  // Search toggle (mobile quick toggle)
  window.toggleSearch = function () {
    const sb = document.getElementById('sSearchbar');
    if (sb) {
      const visible = sb.style.display !== 'none';
      sb.style.display = visible ? 'none' : '';
      if (!visible) document.getElementById('sSearchInput').focus();
    }
  };

  // ── AUTH UI ──
  function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem('shopire_user') || 'null');
    const token = localStorage.getItem('shopire_token');
    const accountLink = document.querySelector('.s-icon-btn[title="Account"]') || document.querySelector('.s-icon-btn[title="Login"]');
    if (accountLink) {
      if (user && token) {
        accountLink.href = 'orders.html';
        accountLink.title = user.name;
        accountLink.innerHTML = `<i class="fas fa-user-check" style="color:var(--red)"></i>`;
      } else {
        accountLink.href = 'login.html';
        accountLink.title = 'Login';
        accountLink.innerHTML = `<i class="far fa-user"></i>`;
      }
    }

    // Mobile menu auth buttons
    const mobileAuth = document.getElementById('sMobileAuthBtns');
    if (mobileAuth) {
      if (user && token) {
        mobileAuth.innerHTML = `
          <div style="padding:14px 16px;border-top:1px solid #eee;margin-top:8px">
            <div style="font-size:13px;color:#777;margin-bottom:10px">👤 Signed in as <strong style="color:#111">${user.name}</strong></div>
            <a href="orders.html" class="s-mobile-btn-full s-mobile-btn-outline" style="margin-bottom:8px"><i class="fas fa-box"></i> My Orders</a>
            <a href="#" class="s-mobile-btn-full s-mobile-btn-outline" onclick="navLogout(event)" style="color:#e53e3e;border-color:#e53e3e"><i class="fas fa-sign-out-alt"></i> Logout</a>
          </div>`;
      } else {
        mobileAuth.innerHTML = `
          <div style="padding:14px 16px;border-top:1px solid #eee;margin-top:8px;display:flex;gap:8px">
            <a href="login.html" class="s-mobile-btn-full s-mobile-btn-red" style="flex:1"><i class="fas fa-sign-in-alt"></i> Login</a>
            <a href="login.html#signup" class="s-mobile-btn-full s-mobile-btn-outline" style="flex:1"><i class="fas fa-user-plus"></i> Sign Up</a>
          </div>`;
      }
    }

    // Add logout option to topbar if logged in
    const topbarRight = document.querySelector('.s-topbar-right');
    if (topbarRight && user && token) {
      if (!document.getElementById('nav-logout-btn')) {
        topbarRight.innerHTML = `
          <span style="color:#bbb">Salam, <strong style="color:white">${user.name}</strong></span>
          <span class="sep">|</span>
          <a href="orders.html">My Orders</a>
          <span class="sep">|</span>
          <a href="#" id="nav-logout-btn" onclick="navLogout(event)">Logout</a>
        `;
      }
    }
  }

  window.navLogout = function(e) {
    e.preventDefault();
    localStorage.removeItem('shopire_token');
    localStorage.removeItem('shopire_user');
    window.location.href = 'index.html';
  };

  // ── CART COUNT (from backend if logged in, else localStorage) ──
  async function updateCartCount() {
    const token = localStorage.getItem('shopire_token');
    const cartEl = document.getElementById('cartCount');
    const mobileCartEl = document.getElementById('mobileCartCount');
    if (token) {
      try {
        const res = await fetch('http://localhost:5000/api/cart', {
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
        });
        if (res.ok) {
          const data = await res.json();
          const count = data.count || 0;
          if (cartEl) cartEl.textContent = count;
          if (mobileCartEl) mobileCartEl.textContent = count;
          return;
        }
      } catch (e) {}
    }
    // Fallback to localStorage
    const count = parseInt(localStorage.getItem('shopire_cart') || '0');
    if (cartEl) cartEl.textContent = count;
    if (mobileCartEl) mobileCartEl.textContent = count;
  }

  // ── DARK MODE TOGGLE ──
  window.toggleDarkMode = function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('shopire_dark', String(!isDark));
    const icon = document.getElementById('sDarkIcon');
    if (icon) {
      icon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
  };

  // Init dark mode icon state
  (function initDarkIcon() {
    const isDark = localStorage.getItem('shopire_dark') === 'true';
    if (isDark) document.documentElement.setAttribute('data-theme','dark');
    setTimeout(() => {
      const icon = document.getElementById('sDarkIcon');
      if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }, 0);
  })();

  updateAuthUI();
  updateCartCount();

  // "Add to Cart" buttons — backend call if logged in
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-addcart, .btn-deal, [data-add-cart]');
    if (!btn) return;
    const productId = btn.dataset.productId || btn.closest('[data-product-id]')?.dataset.productId;
    const token = localStorage.getItem('shopire_token');

    if (token && productId) {
      try {
        const res = await fetch('http://localhost:5000/api/cart/add', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: parseInt(productId), quantity: 1 })
        });
        if (res.ok) {
          btn.innerHTML = '<i class="fas fa-check"></i> Added!';
          setTimeout(() => { btn.textContent = 'Add to Cart'; }, 1200);
          updateCartCount();
          return;
        }
      } catch (e) {}
    }

    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    // localStorage fallback
    const current = parseInt(localStorage.getItem('shopire_cart') || '0');
    localStorage.setItem('shopire_cart', current + 1);
    updateCartCount();
    btn.textContent = '✓ Added!';
    setTimeout(() => { btn.textContent = 'Add to Cart'; }, 1200);
  });

})();
