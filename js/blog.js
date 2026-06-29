// blog.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  const posts = [
    {
      img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
      cat: "Audio & Tech",
      title: "Top 10 Wireless Headphones You Must Buy in 2025",
      author: "Ali Hassan", date: "March 1, 2025", readTime: "8 min read", comments: 42,
      content: `
        <p>The wireless headphone market in 2025 is more competitive than ever. With dozens of new releases from JBL, Sony, Bose, and Apple, picking the right pair can feel overwhelming. We spent over 200 hours testing to bring you this definitive guide.</p>
        <h3>🥇 1. Sony WH-1000XM5 — Best Overall</h3>
        <p>Sony's flagship remains the gold standard for noise cancellation. The XM5 features industry-leading ANC that blocks out up to 30dB of ambient noise, 40-hour battery life, and multipoint connection for seamless switching between devices. The new V1 processor delivers remarkably clear audio with a wide soundstage.</p>
        <blockquote>"The Sony XM5 is not just a headphone — it's a personal silence bubble that follows you everywhere."</blockquote>
        <h3>🥈 2. Bose QuietComfort Ultra — Best Comfort</h3>
        <p>If you wear headphones for 6+ hours a day, the Bose QC Ultra is unmatched. The memory foam ear cushions distribute weight so evenly that many users forget they're wearing them. The new Immersive Audio mode creates a spatial sound experience that rivals studio monitors.</p>
        <h3>🥉 3. JBL Tour One M3 — Best Value</h3>
        <p>For half the price of Sony and Bose flagships, the JBL Tour One M3 delivers 90% of the experience. AdaptiveNoise Cancelling, 70-hour total battery (with case), and a foldable design make this an incredible value proposition for everyday users.</p>
        <h3>4–10: The Rest of Our Picks</h3>
        <ul>
          <li><strong>Apple AirPods Max (2025)</strong> — Best for Apple ecosystem users, with stunning build quality</li>
          <li><strong>Sennheiser Momentum 4</strong> — Audiophile-grade sound with 60-hour battery</li>
          <li><strong>Jabra Evolve2 85</strong> — Best for office professionals and video calls</li>
          <li><strong>Anker Soundcore Q45</strong> — Best budget pick under $60</li>
          <li><strong>Bowers & Wilkins Px7 S3</strong> — Premium luxury pick with hi-res audio</li>
          <li><strong>Marshall Monitor III</strong> — Best for rock & bass lovers</li>
          <li><strong>Samsung Galaxy Buds3 Pro</strong> — Best compact over-ear hybrid</li>
        </ul>
        <h3>Our Verdict</h3>
        <p>For most people, the Sony WH-1000XM5 remains our top recommendation. It delivers the best all-round package of noise cancellation, sound quality, battery life, and comfort. If budget is a concern, the JBL Tour One M3 is an outstanding alternative that won't disappoint.</p>
      `
    },
    {
      img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&q=80",
      cat: "Smartphones",
      title: "Samsung Galaxy S24 vs iPhone 15 Pro: Who Wins in 2025?",
      author: "Sara Malik", date: "Feb 20, 2025", readTime: "6 min read", comments: 28,
      content: `
        <p>The Samsung vs Apple battle has been raging for over a decade, but 2025 brings the most competitive matchup yet. Both phones represent the absolute pinnacle of their respective ecosystems. Here's our no-holds-barred comparison.</p>
        <h3>📸 Camera: Draw (But Different Strengths)</h3>
        <p>Samsung's 200MP main sensor captures insane detail in ideal lighting, while iPhone's computational photography and ProRes video recording make it the clear winner for content creators. In low light, the iPhone's photon engine produces more natural colors, while Samsung's AI processing tends to over-sharpen.</p>
        <blockquote>"If you shoot landscapes and portraits, go Samsung. If you shoot video and prefer natural tones, go iPhone."</blockquote>
        <h3>⚡ Performance: iPhone Wins</h3>
        <p>Apple's A17 Pro chip continues to dominate benchmarks, outperforming the Snapdragon 8 Gen 3 in sustained performance tasks. In real-world usage, both phones are blazingly fast — but iPhone maintains performance longer under heavy load without thermal throttling.</p>
        <h3>🔋 Battery Life: Samsung Wins</h3>
        <p>The Galaxy S24 Ultra's 5000mAh battery comfortably lasts a full day and a half. The iPhone 15 Pro's smaller 3274mAh battery requires daily charging for heavy users. Samsung also supports 45W wired charging vs Apple's 27W.</p>
        <h3>🎨 Design: Tie</h3>
        <p>Both phones feature premium builds — Samsung's titanium frame with Gorilla Glass Armor vs iPhone's aerospace-grade titanium. Samsung's flat display edges offer easier one-handed use, while iPhone's Dynamic Island remains one of the most clever UI innovations in recent years.</p>
        <h3>💰 Value: Samsung Wins</h3>
        <p>The base S24 starts at $799 vs iPhone's $999 entry price. When you factor in Samsung's trade-in deals and bundled Galaxy AI features, the value gap widens further.</p>
        <h3>Final Verdict</h3>
        <p>Choose Samsung if you want the best camera hardware, longer battery, and more customization. Choose iPhone if you're in the Apple ecosystem, prioritize video quality, or want the smoothest software experience. Both are exceptional — you truly cannot go wrong.</p>
      `
    },
    {
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
      cat: "Smart Home",
      title: "How to Build the Perfect Smart Home on Any Budget",
      author: "Usman Khan", date: "Feb 14, 2025", readTime: "10 min read", comments: 35,
      content: `
        <p>Building a smart home doesn't require spending thousands of dollars. Whether your budget is $100 or $10,000, we'll show you how to create a connected, convenient, and energy-efficient home that actually works.</p>
        <h3>🏠 Step 1: Pick Your Ecosystem First</h3>
        <p>Before buying anything, decide on your smart home platform. The three main options are Amazon Alexa, Google Home, and Apple HomeKit. Your choice affects which devices you can use, so choose based on your existing devices and preferences.</p>
        <blockquote>"The biggest mistake new smart home owners make is buying devices from different ecosystems that don't communicate with each other."</blockquote>
        <h3>💡 Step 2: Start with Smart Lighting (Budget: $30–$100)</h3>
        <p>Smart bulbs are the best entry point. Philips Hue, LIFX, and the budget-friendly Govee all offer excellent options. Smart switches are even better because they work with any bulb and don't require changing every light. Start with your living room and bedroom for maximum impact.</p>
        <h3>🔐 Step 3: Add Smart Security (Budget: $100–$300)</h3>
        <p>A smart video doorbell (Ring or Nest Hello) and one or two indoor cameras provide excellent security coverage. Add smart door locks for keyless entry — the Schlage Encode and August Smart Lock are our top picks. These alone can reduce your home insurance premiums.</p>
        <h3>🌡️ Step 4: Smart Climate Control (Budget: $150–$250)</h3>
        <p>A smart thermostat like the Nest Learning Thermostat or Ecobee pays for itself within a year through energy savings. They learn your schedule, adjust automatically, and can be controlled remotely. Some utility companies even offer rebates for installing them.</p>
        <h3>🔌 Step 5: Smart Plugs and Energy Monitoring</h3>
        <p>Smart plugs turn any device into a smart device. Use them for lamps, fans, coffee makers, and appliances. Energy monitoring plugs help identify power-hungry devices — most people are shocked to discover their gaming PC or old refrigerator is their biggest energy consumer.</p>
        <h3>Total Cost Breakdown</h3>
        <ul>
          <li><strong>Budget Setup ($200–$400):</strong> Smart bulbs + video doorbell + smart plug</li>
          <li><strong>Mid-range ($400–$800):</strong> + Smart thermostat + door lock + 2 cameras</li>
          <li><strong>Premium ($800+):</strong> + Full lighting system + voice assistant speakers + automated routines</li>
        </ul>
      `
    },
    {
      img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80",
      cat: "Laptops",
      title: "Best Laptops for Students and Professionals in 2025",
      author: "Ali Hassan", date: "Jan 30, 2025", readTime: "7 min read", comments: 19,
      content: `
        <p>Choosing the right laptop can make the difference between productivity and frustration. In 2025, the laptop market offers something genuinely great at every price point. Here are our top picks for students and professionals.</p>
        <h3>🎓 Best for Students</h3>
        <p><strong>MacBook Air M3 ($1,099)</strong> — For students who can stretch their budget, the MacBook Air M3 is simply the best all-round student laptop ever made. The fanless design means it never heats up in class, battery lasts 18+ hours, and macOS remains the smoothest operating system for creative work.</p>
        <p><strong>Dell XPS 13 ($999)</strong> — Windows alternative with a gorgeous OLED display, compact size, and excellent keyboard. The 12th Gen Intel Core i7 handles everything a student needs effortlessly.</p>
        <p><strong>Acer Swift Go 14 ($649)</strong> — Best budget pick. Intel Core Ultra processor, 16GB RAM, and a solid 1080p display make this exceptional value for students on a tight budget.</p>
        <blockquote>"For most students, a laptop with 16GB RAM, 512GB SSD, and 10+ hour battery life hits the sweet spot of performance and portability."</blockquote>
        <h3>💼 Best for Professionals</h3>
        <p><strong>MacBook Pro 14" M3 Pro ($1,999)</strong> — The undisputed champion for creative professionals. Video editors, designers, and developers report 2–3x faster render times compared to previous Intel MacBooks. The Liquid Retina XDR display with ProMotion makes every workflow a pleasure.</p>
        <p><strong>Lenovo ThinkPad X1 Carbon Gen 12 ($1,799)</strong> — The business professional's choice for a decade. Military-grade durability, best-in-class keyboard, and legendary reliability. IT departments love it for remote management capabilities.</p>
        <p><strong>ASUS ProArt Studiobook 16 ($2,499)</strong> — For architects, 3D artists, and engineers who need serious GPU power. The OLED display is color-accurate to within 0.4 Delta E — better than most external monitors.</p>
        <h3>Our Top Recommendation</h3>
        <p>For 90% of students: MacBook Air M3. For 90% of professionals: MacBook Pro 14" M3 Pro. For Windows users who need business features: ThinkPad X1 Carbon. These three laptops represent the best value at their respective price points in 2025.</p>
      `
    },
    {
      img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=900&q=80",
      cat: "Gaming",
      title: "Ultimate Gaming Setup Guide: Build Your Dream Battle Station",
      author: "Zain Ahmed", date: "Jan 18, 2025", readTime: "12 min read", comments: 54,
      content: `
        <p>Your gaming setup is your command center, your sanctuary, your competitive edge. Whether you're a casual gamer or a serious streamer, this guide will help you build the ultimate battle station — at any budget.</p>
        <h3>🖥️ The Monitor: Your Most Important Choice</h3>
        <p>Everything else is secondary to your monitor. For competitive gaming (FPS, battle royale), prioritize refresh rate: a 144Hz 1080p monitor outperforms a 60Hz 4K display for reaction-time-sensitive games. For single-player and RPGs, go 4K OLED — the LG C3 OLED is the absolute best gaming monitor money can buy, with 0.1ms response time and perfect blacks.</p>
        <blockquote>"Your GPU renders the frames, but your monitor determines whether you actually see them. Never cheap out on your display."</blockquote>
        <h3>🖱️ Peripherals: Where Feel Matters Most</h3>
        <p>Your mouse, keyboard, and headset are touched constantly — invest here. The Logitech G Pro X Superlight 2 remains the best competitive gaming mouse. For keyboards, the Wooting 60HE with analog actuation is a genuine game-changer for FPS players. For audio, open-back headphones like the Sennheiser HD 560S let you hear footsteps better than any gaming headset.</p>
        <h3>💡 RGB and Aesthetics: The Fun Part</h3>
        <p>RGB lighting isn't just for looks — studies show it reduces eye strain during long sessions. Use a single accent color throughout for a cohesive setup. Keep cables hidden with cable management channels and velcro ties. Desk mats from Artisan or SteelSeries tie the whole setup together visually.</p>
        <h3>🪑 The Chair: Don't Ignore Your Body</h3>
        <p>A bad chair will destroy your posture and cause chronic back pain. Skip the flashy "gaming chairs" from DXRacer — spend that money on a genuine ergonomic chair like the Herman Miller Aeron, Secretlab Titan, or budget option Autonomous ErgoChair Pro. Your spine will thank you in 10 years.</p>
        <h3>Complete Setup Budgets</h3>
        <ul>
          <li><strong>Starter ($500–$800):</strong> 144Hz 1080p monitor, mid-range GPU, budget peripherals</li>
          <li><strong>Mid-tier ($800–$1,500):</strong> 165Hz 1440p monitor, RTX 4070, quality mechanical keyboard + mouse</li>
          <li><strong>Pro Level ($1,500–$3,000+):</strong> 4K OLED monitor, RTX 4090, premium peripherals, streaming setup</li>
        </ul>
        <h3>Final Tip</h3>
        <p>The best gaming setup is one that fits your space, budget, and the games you actually play. Don't spend $2,000 on a setup for casual weekend gaming — but if gaming is your passion and daily hobby, every dollar invested in quality hardware pays dividends in enjoyment and performance.</p>
      `
    }
  ];

  function openPost(index) {
    const post = posts[index];
    document.getElementById('modalImg').src = post.img;
    document.getElementById('modalCat').innerHTML = `<i class="fas fa-tag"></i> ${post.cat}`;
    document.getElementById('modalTitle').textContent = post.title;
    document.getElementById('modalMeta').innerHTML = `
      <div class="modal-meta-item"><i class="fas fa-user"></i> ${post.author}</div>
      <div class="modal-meta-item"><i class="fas fa-calendar-alt"></i> ${post.date}</div>
      <div class="modal-meta-item"><i class="fas fa-clock"></i> ${post.readTime}</div>
      <div class="modal-meta-item"><i class="fas fa-comment"></i> ${post.comments} comments</div>
    `;
    document.getElementById('modalContent').innerHTML = post.content;
    document.getElementById('postModal').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closePost() {
    document.getElementById('postModal').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePost(); });

  document.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });



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