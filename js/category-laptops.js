// category-laptops.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  function toggleWish(el) {
    const i = el.querySelector('i');
    i.classList.toggle('far'); i.classList.toggle('fas');
    el.style.color = i.classList.contains('fas') ? 'var(--red)' : '';
  }
  function addCart(btn) {
    let count = parseInt(document.getElementById('cartCount').textContent) + 1;
    document.getElementById('cartCount').textContent = count;
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }



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