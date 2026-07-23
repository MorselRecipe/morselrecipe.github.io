/* Morsel site - theme toggle, scroll reveal, and contact form handling. */
(function () {
  'use strict';

  // Tells the inline head script it doesn't need to un-hide the reveal content.
  window.__morselReady = true;

  /* ---- Theme toggle (persisted, respects system default) ---- */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  var stored = null;
  try { stored = localStorage.getItem('morsel-theme'); } catch (e) {}
  if (stored === 'dark' || stored === 'light') root.setAttribute('data-theme', stored);

  function currentTheme() {
    // Light is the default; dark only when the user has explicitly chosen it.
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  function paintToggle() {
    if (!toggle) return;
    var isDark = currentTheme() === 'dark';
    var use = toggle.querySelector('use');
    // Show the icon of the theme you'd switch TO: sun in dark, moon in light.
    if (use) use.setAttribute('href', isDark ? '#i-sun' : '#i-moon');
    toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  if (toggle) {
    paintToggle();
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('morsel-theme', next); } catch (e) {}
      paintToggle();
    });
  }

  /* ---- Mobile navigation ----
     Below 860px the inline links are hidden, so without this the site had no
     navigation at all on a phone. */
  var navToggle = document.querySelector('.nav-toggle');
  var navPanel = document.getElementById('mobile-nav');
  if (navToggle && navPanel) {
    var setNav = function (open) {
      navPanel.hidden = !open;
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      var use = navToggle.querySelector('use');
      if (use) use.setAttribute('href', open ? '#i-close' : '#i-menu');
    };
    navToggle.addEventListener('click', function () { setNav(navPanel.hidden); });
    // Following a link should dismiss the panel it was opened from.
    navPanel.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !navPanel.hidden) { setNav(false); navToggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860 && !navPanel.hidden) setNav(false);
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = String(new Date().getFullYear());

  var SUPPORT_EMAIL = 'morselrecipeapp@gmail.com';

  /* ---- Copy-to-clipboard ---- */
  function copyText(text, btn) {
    function done() {
      if (!btn) return;
      if (!btn.getAttribute('data-label')) btn.setAttribute('data-label', btn.textContent);
      btn.textContent = 'Copied';
      setTimeout(function () { btn.textContent = btn.getAttribute('data-label'); }, 2000);
    }
    function legacy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, legacy);
    } else {
      legacy();
    }
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () { copyText(btn.getAttribute('data-copy'), btn); });
  });

  /* ---- Early access: never fail silently ----
     A mailto: click on a device with no mail handler fires no navigation and no
     error, so the primary CTA would appear to do nothing at all. Revealing the
     fallback on every click guarantees the action always produces a visible
     result, and leaves the address on screen if the handoff didn't happen. */
  document.querySelectorAll('[data-early-access]').forEach(function (el) {
    el.addEventListener('click', function () {
      var panel = document.querySelector(el.getAttribute('data-fallback') || '');
      if (panel) panel.hidden = false;
    });
  });

  /* ---- Contact form ---- */
  var form = document.getElementById('contact-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');

  function showStatus(kind, msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status show ' + kind;
  }

  /* ---- Early-access topic reveals the Play Store email field ---- */
  var topic = document.getElementById('topic');
  var playField = document.getElementById('play-field');
  var playEmail = document.getElementById('play-email');
  if (topic && playField) {
    var syncPlayField = function () {
      playField.hidden = topic.value !== 'Early access';
      if (playField.hidden && playEmail) playEmail.value = '';
    };
    topic.addEventListener('change', syncPlayField);
    syncPlayField();
  }

  form.addEventListener('submit', function (ev) {
    // The live endpoint lives in data-endpoint, never in `action` - see the
    // comment on the <form> in index.html.
    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    ev.preventDefault();

    // No backend configured yet → hand off to a pre-filled email draft.
    if (!endpoint) {
      var data = new FormData(form);
      var subject = 'Morsel contact - ' + (data.get('topic') || 'General');
      var play = data.get('play_email');
      var body =
        'Name: ' + (data.get('name') || '') + '\n' +
        'Email: ' + (data.get('email') || '') + '\n' +
        (play ? 'Google Play Store email: ' + play + '\n' : '') + '\n' +
        (data.get('message') || '');
      window.location.href =
        'mailto:' + SUPPORT_EMAIL + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      // Reported as information, not success: the handoff can't be confirmed,
      // and the fields are left filled so nothing is lost if it didn't happen.
      showStatus('info', 'Opening your email app… if nothing happens, send your message to ' + SUPPORT_EMAIL + ' instead.');
      return;
    }

    // Configured (e.g. Formspree) → submit via fetch for a smooth inline result.
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          form.reset();
          showStatus('ok', 'Thanks! Your message is on its way - we’ll reply soon.');
        } else {
          showStatus('err', 'Something went wrong. Please email ' + SUPPORT_EMAIL + ' instead - your message is still in the form.');
        }
      })
      .catch(function () {
        showStatus('err', 'Network error. Please email ' + SUPPORT_EMAIL + ' instead - your message is still in the form.');
      })
      .finally(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
      });
  });
})();
