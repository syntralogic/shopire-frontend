// contact.js - SHOPIRE

// Dark mode persist - runs before page renders (no flash)
  (function(){
    if(localStorage.getItem('shopire_dark')==='true'){
      document.documentElement.setAttribute('data-theme','dark');
    }
  })();



  // FAQ Toggle
  function toggleFaq(el) {
    const answer = el.nextElementSibling;
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });
    if (!isOpen) {
      el.classList.add('open');
      answer.classList.add('open');
    }
  }

  // Star Rating
  const stars = document.querySelectorAll('#starRating i');
  let selectedRating = 0;
  stars.forEach(star => {
    star.addEventListener('mouseover', function() {
      const val = parseInt(this.dataset.val);
      stars.forEach((s, i) => {
        s.classList.toggle('fas', i < val);
        s.classList.toggle('far', i >= val);
        s.classList.toggle('active', i < val);
      });
    });
    star.addEventListener('mouseout', function() {
      stars.forEach((s, i) => {
        s.classList.toggle('fas', i < selectedRating);
        s.classList.toggle('far', i >= selectedRating);
        s.classList.toggle('active', i < selectedRating);
      });
    });
    star.addEventListener('click', function() {
      selectedRating = parseInt(this.dataset.val);
    });
  });

  // Form Validation & Submit
  function sendMessage() {
    let valid = true;

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const agree = document.getElementById('agreeCheck');}

    // Reset
    document.querySelectorAll('.error-msg').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea')
      .forEach(el => el.classList.remove('error'));

    if (!firstName.value.trim()) {
      showError(firstName, 'firstNameErr'); valid = false;
    }
    if (!lastName.value.trim()) {
      showError(lastName, 'lastNameErr'); valid = false;
    }
    if (!email.value.trim() || !email.value.includes('@')) {
      showError(email, 'emailErr'); valid = false;
    }
    if (!subject.value) {
      showError(subject, 'subjectErr'); valid = false;
    }
    if (!message.value.trim()) {
      showError(message, 'messageErr'); valid = false;
    }
    if (!agree.checked) {
      alert('Please agree to the Privacy Policy to continue.'); valid = false;
    }

    if (valid) {
      const btn = document.querySelector('.btn-send');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;}<script src="js/api.js">