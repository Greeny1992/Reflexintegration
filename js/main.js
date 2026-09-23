(function () {
  'use strict';

  // Navbar scroll behaviour
  var navbar = document.querySelector('.navbar');
  var navToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Mobile menu toggle
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link highlighting
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a, .mobile-menu a');

  function highlightNav() {
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });

  // Scroll reveal
  var reveals = document.querySelectorAll('.reveal');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(function (el) { observer.observe(el); });

  // Contact form
  var form = document.getElementById('contact-form');
  var statusEl = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.className = 'form-status';
      statusEl.style.display = 'none';

      // Clear previous errors
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });
      form.querySelectorAll('.error-message').forEach(function (el) {
        el.style.display = 'none';
      });

      // Validate
      var valid = true;

      function showError(name, msg) {
        var input = form.querySelector('[name="' + name + '"]');
        if (input) {
          input.classList.add('error');
          var errEl = input.parentElement.querySelector('.error-message');
          if (errEl) {
            errEl.textContent = msg;
            errEl.style.display = 'block';
          }
        }
        valid = false;
      }

      var name = form.querySelector('[name="name"]').value.trim();
      var email = form.querySelector('[name="email"]').value.trim();
      var message = form.querySelector('[name="message"]').value.trim();
      var consent = form.querySelector('[name="consent"]').checked;

      if (!name) showError('name', 'Bitte gib deinen Namen ein.');
      if (!email) {
        showError('email', 'Bitte gib deine E-Mail-Adresse ein.');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('email', 'Bitte gib eine gültige E-Mail-Adresse ein.');
      }
      if (!message) showError('message', 'Bitte schreibe eine Nachricht.');
      if (!consent) {
        valid = false;
        var consentBox = form.querySelector('[name="consent"]');
        consentBox.parentElement.style.outline = '2px solid #e53e3e';
        consentBox.parentElement.style.borderRadius = '4px';
        consentBox.parentElement.style.padding = '4px';
      }

      if (!valid) return;

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Wird gesendet…';

      var formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            statusEl.className = 'form-status success';
            statusEl.textContent = 'Vielen Dank! Deine Nachricht wurde gesendet. Ich melde mich so bald wie möglich bei dir.';
            statusEl.style.display = 'block';
            form.reset();
          } else {
            throw new Error(data.message || 'Fehler beim Senden');
          }
        })
        .catch(function () {
          statusEl.className = 'form-status error';
          statusEl.textContent = 'Leider ist ein Fehler aufgetreten. Bitte versuche es später erneut oder kontaktiere mich direkt per E-Mail.';
          statusEl.style.display = 'block';
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Nachricht senden';
        });
    });
  }
})();
