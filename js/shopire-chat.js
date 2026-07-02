(function () {
  /* ── STYLES ── */
  const style = document.createElement('style');
  style.textContent = `
    #s-chat-btn {
      position: fixed; bottom: 28px; right: 28px; z-index: 9998;
      width: 56px; height: 56px; border-radius: 50%;
      background: #f3340c; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 18px rgba(243,52,12,.45);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; transition: transform .2s, box-shadow .2s;
    }
    #s-chat-btn:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(243,52,12,.55); }
    #s-chat-btn .s-chat-badge {
      position: absolute; top: -3px; right: -3px;
      background: #111; color: #fff; font-size: 10px; font-weight: 700;
      width: 18px; height: 18px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      border: 2px solid #fff;
    }

    #s-chat-box {
      position: fixed; bottom: 96px; right: 28px; z-index: 9999;
      width: 360px; max-width: calc(100vw - 40px);
      background: #fff; border-radius: 18px;
      box-shadow: 0 12px 48px rgba(0,0,0,.18);
      display: flex; flex-direction: column; overflow: hidden;
      transform: scale(.9) translateY(20px); opacity: 0;
      pointer-events: none; transition: all .25s cubic-bezier(.34,1.56,.64,1);
      font-family: 'Barlow', sans-serif;
    }
    #s-chat-box.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

    .s-chat-head {
      background: linear-gradient(135deg, #111 0%, #1a1a2e 100%);
      padding: 16px 18px; display: flex; align-items: center; gap: 12px;
    }
    .s-chat-head-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #f3340c; display: flex; align-items: center; justify-content: center;
      font-size: 18px; flex-shrink: 0;
    }
    .s-chat-head-info { flex: 1; }
    .s-chat-head-info strong { color: #fff; font-size: 14px; font-weight: 800; display: block; }
    .s-chat-head-info span { color: #aaa; font-size: 12px; }
    .s-chat-online { width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block; margin-right: 4px; }
    .s-chat-close {
      background: rgba(255,255,255,.1); border: none; color: #fff;
      width: 30px; height: 30px; border-radius: 50%; cursor: pointer;
      display: flex; align-items: center; justify-content: center; font-size: 14px;
      transition: background .2s;
    }
    .s-chat-close:hover { background: rgba(255,255,255,.2); }

    .s-chat-msgs {
      flex: 1; overflow-y: auto; padding: 16px; height: 320px;
      display: flex; flex-direction: column; gap: 10px;
      scroll-behavior: smooth;
    }
    .s-chat-msgs::-webkit-scrollbar { width: 4px; }
    .s-chat-msgs::-webkit-scrollbar-thumb { background: #e0e0e0; border-radius: 4px; }

    .s-msg { display: flex; gap: 8px; max-width: 88%; }
    .s-msg.bot { align-self: flex-start; }
    .s-msg.user { align-self: flex-end; flex-direction: row-reverse; }

    .s-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: #f3340c; color: #fff; font-size: 13px;
      display: flex; align-items: center; justify-content: center; margin-top: 2px;
    }
    .s-msg.user .s-msg-avatar { background: #111; }

    .s-msg-bubble {
      padding: 10px 14px; border-radius: 14px; font-size: 13px; line-height: 1.5;
    }
    .s-msg.bot .s-msg-bubble {
      background: #f5f5f5; color: #222; border-bottom-left-radius: 4px;
    }
    .s-msg.user .s-msg-bubble {
      background: #f3340c; color: #fff; border-bottom-right-radius: 4px;
    }

    .s-chat-typing { display: flex; align-items: center; gap: 4px; padding: 10px 14px; background: #f5f5f5; border-radius: 14px; border-bottom-left-radius: 4px; }
    .s-chat-typing span { width: 6px; height: 6px; border-radius: 50%; background: #999; animation: s-bounce .9s infinite; }
    .s-chat-typing span:nth-child(2) { animation-delay: .15s; }
    .s-chat-typing span:nth-child(3) { animation-delay: .3s; }
    @keyframes s-bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

    .s-chat-quick { padding: 8px 12px; display: flex; flex-wrap: wrap; gap: 6px; border-top: 1px solid #f0f0f0; }
    .s-chat-quick button {
      background: #fff; border: 1px solid #e0e0e0; color: #444;
      padding: 5px 12px; border-radius: 50px; font-size: 12px; font-weight: 600;
      cursor: pointer; font-family: 'Barlow', sans-serif; transition: all .15s;
    }
    .s-chat-quick button:hover { border-color: #f3340c; color: #f3340c; background: #fff5f3; }

    .s-chat-input-row {
      padding: 12px; border-top: 1px solid #f0f0f0; display: flex; gap: 8px;
    }
    .s-chat-input-row input {
      flex: 1; border: 1px solid #e0e0e0; border-radius: 50px; padding: 9px 16px;
      font-size: 13px; font-family: 'Barlow', sans-serif; outline: none; color: #222;
      transition: border-color .2s;
    }
    .s-chat-input-row input:focus { border-color: #f3340c; }
    .s-chat-input-row button {
      width: 38px; height: 38px; border-radius: 50%; background: #f3340c; color: #fff;
      border: none; cursor: pointer; font-size: 15px; display: flex;
      align-items: center; justify-content: center; flex-shrink: 0;
      transition: background .2s;
    }
    .s-chat-input-row button:hover { background: #d42a08; }
    .s-chat-input-row button:disabled { background: #ccc; cursor: not-allowed; }

    [data-theme="dark"] #s-chat-box { background: #1e1e1e; }
    [data-theme="dark"] .s-msg.bot .s-msg-bubble { background: #2a2a2a; color: #e0e0e0; }
    [data-theme="dark"] .s-chat-quick { border-color: #333; }
    [data-theme="dark"] .s-chat-quick button { background: #2a2a2a; border-color: #444; color: #ccc; }
    [data-theme="dark"] .s-chat-quick button:hover { border-color: #f3340c; color: #f3340c; background: #2a1a18; }
    [data-theme="dark"] .s-chat-input-row { border-color: #333; }
    [data-theme="dark"] .s-chat-input-row input { background: #2a2a2a; border-color: #444; color: #e0e0e0; }
    [data-theme="dark"] .s-chat-typing { background: #2a2a2a; }
    [data-theme="dark"] .s-chat-msgs::-webkit-scrollbar-thumb { background: #444; }
  `;
  document.head.appendChild(style);

  /* ── HTML ── */
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <button id="s-chat-btn" title="Chat with Shopire Assistant">
      <i class="fas fa-comment-dots"></i>
      <span class="s-chat-badge">1</span>
    </button>
    <div id="s-chat-box">
      <div class="s-chat-head">
        <div class="s-chat-head-avatar">🛒</div>
        <div class="s-chat-head-info">
          <strong>Shopire Assistant</strong>
          <span><span class="s-chat-online"></span>Online — here to help</span>
        </div>
        <button class="s-chat-close" id="s-chat-close"><i class="fas fa-times"></i></button>
      </div>
      <div class="s-chat-msgs" id="s-chat-msgs"></div>
      <div class="s-chat-quick" id="s-chat-quick">
        <button>Track my order</button>
        <button>Return policy</button>
        <button>Shipping info</button>
        <button>Best deals</button>
      </div>
      <div class="s-chat-input-row">
        <input type="text" id="s-chat-input" placeholder="Type a message..." autocomplete="off"/>
        <button id="s-chat-send"><i class="fas fa-paper-plane"></i></button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);

  /* ── STATE ── */
  const box = document.getElementById('s-chat-box');
  const btn = document.getElementById('s-chat-btn');
  const closeBtn = document.getElementById('s-chat-close');
  const msgsEl = document.getElementById('s-chat-msgs');
  const input = document.getElementById('s-chat-input');
  const sendBtn = document.getElementById('s-chat-send');
  const badge = btn.querySelector('.s-chat-badge');
  const quickEl = document.getElementById('s-chat-quick');

  let isOpen = false;
  let history = [];
  let isTyping = false;
  let awaitingOrderNum = false;

  // ── RULE-BASED RESPONSE ENGINE ──
  const RULES = [
    // Greetings
    { p: /^(hi|hello|hey|salam|assalam|hola|good\s?(morning|evening|afternoon)|howdy)/i,
      r: ["Hi there! 👋 Welcome to SHOPIRE! I'm ALEX, your shopping assistant. How can I help you today?",
          "Hello! 😊 Great to see you at SHOPIRE! Looking for something specific, or can I help you find the perfect product?"] },

    // Orders
    { p: /order.*status|track.*order|where.*order|my order/i,
      r: () => { awaitingOrderNum = true; return "Sure! I can help you track your order. Please share your Order ID (e.g. #SHP12345) and I'll look it up for you! 📦"; } },
    { p: /^#?SHP\d+$|order.*#?\d{4,}/i,
      r: (m) => { awaitingOrderNum = false; return `Got it! Checking order ${m}... 🔍 Your order is currently **In Transit** and expected to arrive within 2-3 business days. You'll receive an email with tracking details shortly! 📬`; } },

    // Returns & Refunds
    { p: /return|refund|exchange|money back/i,
      r: ["Great news! SHOPIRE offers **30-day hassle-free returns** on all items. 🔄\n\nJust go to My Orders → Select the item → Click 'Return'. Refunds are processed within 3-5 business days to your original payment method.",
          "Our return policy is simple: **30 days, no questions asked!** 💯\n\nItems must be in original condition. Once we receive the return, refunds hit your account in 3-5 business days."] },

    // Shipping
    { p: /ship|deliver|how long|when.*arriv|express|fast deliver/i,
      r: ["**Shipping Options:** 🚚\n\n• **Standard** (3-7 days) — FREE on orders over $50, otherwise $5.99\n• **Express** (1-2 days) — $12.99\n• **Same Day** (select cities) — $19.99\n\nAll orders are dispatched within 24 hours!"] },

    // Payment
    { p: /pay|payment|card|visa|mastercard|paypal|cash|cod|credit/i,
      r: ["We accept all major payment methods at SHOPIRE! 💳\n\n• Credit/Debit Cards (Visa, Mastercard, Amex)\n• PayPal\n• Cash on Delivery (COD)\n• Stripe\n\nAll transactions are 256-bit SSL encrypted for your safety! 🔒"] },

    // Discount / Promo
    { p: /discount|promo|coupon|code|offer|sale|deal/i,
      r: ["Here are our active promo codes! 🎉\n\n• **SAVE10** — 10% off any order\n• **SHOPIRE20** — 20% off $100+\n• **WELCOME15** — 15% off first order\n\nAlso check our Flash Sale banner at the top for today's deals! ⚡"] },

    // Products - Laptops
    { p: /laptop|macbook|dell|hp|lenovo|asus.*laptop|notebook/i,
      r: ["We have an amazing laptop collection! 💻\n\nTop picks:\n• MacBook Pro 14\" M3 — $1,699\n• Dell XPS 13 — $899\n• ASUS ROG Gaming — $1,299\n\nVisit our **Laptops** category for full specs & comparisons! All come with manufacturer warranty."] },

    // Products - Phones
    { p: /phone|smartphone|iphone|samsung|mobile|android/i,
      r: ["Our smartphone lineup is 🔥\n\nFeatured picks:\n• Samsung Galaxy S24 Ultra\n• iPhone 15 Pro Max\n• Google Pixel 8 Pro\n\nAll unlocked, with free screen protector on orders today! Check the **Smartphones** category for deals."] },

    // Products - Headphones
    { p: /headphone|earphone|earbud|airpod|speaker|audio|sound/i,
      r: ["Great audio selection at SHOPIRE! 🎧\n\nBest sellers:\n• Sony WH-1000XM5 (Noise Cancelling) — $349\n• Apple AirPods Pro — $249\n• Bose QuietComfort 45 — $279\n\nAll come with 1-year warranty and free case!"] },

    // Products - Gaming
    { p: /gaming|game|xbox|playstation|ps5|controller|gpu|graphics/i,
      r: ["Level up with SHOPIRE's gaming gear! 🎮\n\nHot items:\n• Gaming Chairs (ergonomic, RGB)\n• Mechanical Keyboards\n• High-refresh monitors (144Hz, 240Hz)\n• Gaming headsets\n\nCheck the **Gaming** category for full selection!"] },

    // Cameras
    { p: /camera|dslr|mirrorless|canon|nikon|sony.*camera|gopro/i,
      r: ["Capture every moment with our cameras! 📷\n\nFeatured:\n• Sony A7 IV (Mirrorless) — $2,499\n• Canon EOS R50 — $879\n• GoPro Hero 12 — $399\n\nAll cameras include a free memory card this week! 🎁"] },

    // Warranty
    { p: /warrant|guarantee|broken|defect|repair/i,
      r: ["All SHOPIRE products come with **manufacturer warranty**! 🛡️\n\n• Electronics: 1 year\n• Laptops & Phones: 1-2 years\n• Furniture: 3 years\n\nFor warranty claims, contact support@shopire.com with your order number and photos of the issue."] },

    // Account / Login
    { p: /account|login|sign.*in|register|sign.*up|password|forgot/i,
      r: ["For account help, you can:\n\n• **Login/Register** — Click the account icon in the top nav\n• **Forgot password** — Click 'Forgot Password' on login page\n• **Orders** — Visit 'My Orders' after logging in\n\nNeed more help? Email us at support@shopire.com 📧"] },

    // Contact / Human
    { p: /human|agent|person|contact|support|email|call|phone.*number|speak/i,
      r: ["Connect with our team! 📞\n\n• **Phone:** +88 (9800) 6802 (24/7)\n• **Email:** support@shopire.com\n• **Live Chat:** You're already here! 😊\n• **Response time:** Usually under 2 hours\n\nOr visit our **Contact** page for the full form!"] },

    // Stores / Location
    { p: /store|location|address|near me|visit|physical/i,
      r: ["SHOPIRE is primarily an **online store** 🌐 delivering nationwide!\n\nHowever, we do have pickup points in:\n• Karachi\n• Lahore\n• Islamabad\n\nFor store addresses, visit our **Find a Store** page in the top nav!"] },

    // Thank you
    { p: /thank|thanks|thx|appreciate|great|awesome|perfect|helpful/i,
      r: ["You're so welcome! 😊 Happy shopping at SHOPIRE! 🛍️",
          "My pleasure! Is there anything else I can help you with today? 💙",
          "Glad I could help! Don't forget to check our Flash Sale for today's best deals! ⚡"] },

    // Bye
    { p: /bye|goodbye|see you|later|cya/i,
      r: ["Goodbye! 👋 Thanks for visiting SHOPIRE. Happy shopping! 🛍️",
          "See you soon! Don't forget — we have new deals every day! Come back anytime 😊"] },

    // Price / Expensive / Cheap
    { p: /price|cost|expensive|cheap|afford|budget/i,
      r: ["SHOPIRE offers products for every budget! 💰\n\n• **Under $50** — Accessories, cables, cases\n• **$50–$300** — Headphones, smartwatches, small gadgets\n• **$300–$1000** — Cameras, tablets, mid-range laptops\n• **$1000+** — Premium laptops, DSLRs, 4K monitors\n\nUse filter on the Shop page to sort by price!"] },

    // Default fallback
    { p: /.*/,
      r: ["I'm not sure about that, but I'd love to help! 🤔\n\nYou can ask me about:\n• Products & prices\n• Orders & tracking\n• Shipping & returns\n• Promo codes\n• Payment options\n\nOr type **'contact'** to reach a human agent! 😊",
          "Hmm, let me point you in the right direction! Try asking about:\n• 'track my order'\n• 'return policy'\n• 'shipping info'\n• 'promo codes'\n• 'contact support'\n\nI'm always here to help! 💙"] }
  ];

  function getBotReply(text) {
    // Check if waiting for order number
    if (awaitingOrderNum && /\d{4,}/.test(text)) {
      awaitingOrderNum = false;
      return `Checking order... 🔍 Your order **#${text.replace(/[^0-9]/g,'')}** is **In Transit** and expected within 2-3 business days! You'll get a tracking email soon. 📬`;
    }
    for (const rule of RULES) {
      if (rule.p.test(text)) {
        const resp = typeof rule.r === 'function' ? rule.r(text) : rule.r;
        return Array.isArray(resp) ? resp[Math.floor(Math.random() * resp.length)] : resp;
      }
    }
  }

  /* ── OPEN / CLOSE ── */
  btn.addEventListener('click', () => toggle(true));
  closeBtn.addEventListener('click', () => toggle(false));

  function toggle(open) {
    isOpen = open;
    box.classList.toggle('open', open);
    if (open) {
      badge.style.display = 'none';
      if (msgsEl.children.length === 0) botGreet();
      setTimeout(() => input.focus(), 300);
    }
  }

  /* ── MESSAGES ── */
  function addMsg(text, role) {
    const div = document.createElement('div');
    div.className = `s-msg ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 's-msg-avatar';
    avatar.textContent = role === 'bot' ? '🛒' : '👤';
    const bubble = document.createElement('div');
    bubble.className = 's-msg-bubble';
    // Support bold **text**
    bubble.innerHTML = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    div.appendChild(avatar);
    div.appendChild(bubble);
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 's-msg bot';
    div.id = 's-typing-indicator';
    div.innerHTML = `<div class="s-msg-avatar">🛒</div><div class="s-chat-typing"><span></span><span></span><span></span></div>`;
    msgsEl.appendChild(div);
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('s-typing-indicator');
    if (t) t.remove();
  }

  function botGreet() {
    addMsg("Hi there! 👋 I'm **ALEX**, SHOPIRE's shopping assistant!\n\nI can help you with orders, products, shipping, returns & more. What can I do for you today?", 'bot');
  }

  /* ── QUICK REPLIES ── */
  quickEl.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      input.value = e.target.textContent;
      send();
    }
  });

  /* ── SEND ── */
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });

  async function send() {
    const text = input.value.trim();
    if (!text || isTyping) return;
    input.value = '';
    addMsg(text, 'user');
    history.push({ role: 'user', content: text });
    quickEl.style.display = 'none';
    isTyping = true;
    sendBtn.disabled = true;
    showTyping();

    // Simulate natural typing delay (600-1200ms)
    const delay = 600 + Math.random() * 600;
    await new Promise(r => setTimeout(r, delay));

    removeTyping();
    const reply = getBotReply(text);
    addMsg(reply, 'bot');
    history.push({ role: 'assistant', content: reply });

    isTyping = false;
    sendBtn.disabled = false;
  }
})();
