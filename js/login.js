// login.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



    // Redirect if already logged in
    if (isLoggedIn()) window.location.href = 'index.html';

    function switchTab(tab) {
      document.querySelectorAll('.tab-btn').forEach((b, i) => {
        b.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
      });
      document.getElementById('loginPanel').classList.toggle('active', tab === 'login');
      document.getElementById('signupPanel').classList.toggle('active', tab === 'signup');
    }

    function showMsg(id, text, type) {
      const el = document.getElementById(id);
      el.textContent = text;
      el.className = 'msg ' + type;
      el.style.display = 'block';
    }

    async function doLogin() {
      const email = document.getElementById('loginEmail').value.trim();
      const pass = document.getElementById('loginPassword').value;
      if (!email || !pass) return showMsg('loginMsg', 'Please enter email and password', 'error');
      const btn = document.getElementById('loginBtn');
      btn.disabled = true; btn.textContent = 'Please wait...';
      try {
        const loginResult = await Auth.login(email, pass);
        showMsg('loginMsg', `✅ Welcome, ${loginResult.user.name}! Redirecting...`, 'success');
        setTimeout(() => window.location.href = 'index.html', 800);
      } catch (e) {
        showMsg('loginMsg', e.message, 'error');
        btn.disabled = false; btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
      }
    }

    async function doSignup() {
      const name = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const pass = document.getElementById('signupPassword').value;
      if (!name || !email || !pass) return showMsg('signupMsg', 'All fields are required', 'error');
      if (pass.length < 6) return showMsg('signupMsg', 'Password must be at least 6 characters', 'error');
      const btn = document.getElementById('signupBtn');
      btn.disabled = true; btn.textContent = 'Please wait...';
      try {
        await Auth.signup(name, email, pass);
        showMsg('signupMsg', '✅ Account created! You can now login 🎉', 'success');
        btn.innerHTML = '<i class="fas fa-check"></i> Account Created!';
        setTimeout(() => {
          switchTab('login');
          btn.disabled = false;
          btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        }, 1500);
      } catch (e) {
        showMsg('signupMsg', e.message, 'error');
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
      }
    }

    // Enter key support
    document.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        if (document.getElementById('loginPanel').classList.contains('active')) doLogin();
        else doSignup();
      }
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