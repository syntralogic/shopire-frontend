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

  const SYSTEM = `You are a friendly and helpful customer support assistant for SHOPIRE, an online electronics and furniture store. 
Keep answers short (2-4 sentences max). Be warm and professional.
SHOPIRE sells: Smartphones, Laptops, Headphones, Cameras, Monitors, Gaming gear, Wearables, Audio, Furniture, and Tablets.
Return policy: 30-day returns on all items. Shipping: Free on orders over $50, otherwise $5.99. Delivery: 3-7 business days standard, 1-2 days express.
For order tracking, ask for their order number. For product questions, give helpful buying advice.
Always stay on topic about SHOPIRE products and services.`;

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
    bubble.textContent = text;
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
    addMsg("Hi there! 👋 Welcome to SHOPIRE! I'm your shopping assistant. How can I help you today?", 'bot');
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

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          system: SYSTEM,
          messages: history
        })
      });
      const data = await res.json();
      const reply = (data.content && data.content[0] && data.content[0].text)
        ? data.content[0].text
        : "Sorry, I couldn't get a response right now. Please try again!";
      removeTyping();
      addMsg(reply, 'bot');
      history.push({ role: 'assistant', content: reply });
    } catch (err) {
      removeTyping();
      addMsg("Oops! Something went wrong. Please try again in a moment.", 'bot');
    }

    isTyping = false;
    sendBtn.disabled = false;
  }
})();
