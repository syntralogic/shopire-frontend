// admin-login.js - SHOPIRE Admin Login Logic

// If already logged in as admin, go directly to panel
document.addEventListener('DOMContentLoaded', () => {
  if (isLoggedIn() && isAdmin()) {
    window.location.href = 'index.html';
  }
});

function showMsg(text, type) {
  const el = document.getElementById('loginMsg');
  el.textContent = text;
  el.className = 'msg ' + type + ' show';
}

async function doAdminLogin() {
  const email = document.getElementById('adminEmail').value.trim();
  const pass  = document.getElementById('adminPassword').value;

  if (!email || !pass) {
    showMsg('Please enter email and password', 'error');
    return;
  }

  const btn = document.getElementById('loginBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

  try {
    const result = await Auth.login(email, pass);

    // Role check - only admin allowed
    if (!result.user || result.user.role !== 'admin') {
      // Remove non-admin token
      localStorage.removeItem('shopire_token');
      localStorage.removeItem('shopire_user');
      showMsg('❌ Access denied. This account does not have admin privileges.', 'error');
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-shield-alt"></i> Admin Login';
      return;
    }

    showMsg(`✅ Welcome ${result.user.name}! Redirecting to panel...`, 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 900);

  } catch (e) {
    showMsg('❌ ' + e.message, 'error');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-shield-alt"></i> Admin Login';
  }
}
