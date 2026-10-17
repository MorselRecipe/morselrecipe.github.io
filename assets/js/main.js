/* Morsel site - theme toggle, scroll reveal, and contact form handling. */
(function () {
  'use strict';

  // Tells the inline head script it doesn't need to un-hide the reveal content.
  window.__morselReady = true;

  /* ---- Theme toggle (persisted, respects system default) ---- */
  var root = document.documentElement;
  var toggle = document.querySelector('.theme-toggle');
  // The inline head script has already resolved the theme (stored choice, else
  // the OS setting) before first paint; this only keeps it current.
  var stored = null;
  try { stored = localStorage.getItem('morsel-theme'); } catch (e) {}
  var hasChoice = stored === 'dark' || stored === 'light';

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  // Until the visitor picks a theme, follow the OS live, e.g. at sunset.
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if (mq) {
    var onSystemChange = function (ev) {
      if (hasChoice) return;
      root.setAttribute('data-theme', ev.matches ? 'dark' : 'light');
      paintToggle();
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
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
      hasChoice = true;
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

  /* ---- Feature tabs ----
     Panels are all visible in the markup; tabbing is layered on here so the
     features still read as a stacked list if this never runs. */
  var featureTabs = document.querySelector('.feature-tabs');
  if (featureTabs) {
    var tabs = Array.prototype.slice.call(featureTabs.querySelectorAll('[role="tab"]'));
    var selectTab = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) {
        tab.focus();
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    };
    featureTabs.classList.add('is-tabbed');
    selectTab(tabs[0], false);
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab, false); });
      tab.addEventListener('keydown', function (ev) {
        var next = null;
        if (ev.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (ev.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (ev.key === 'Home') next = tabs[0];
        else if (ev.key === 'End') next = tabs[tabs.length - 1];
        if (next) { ev.preventDefault(); selectTab(next, true); }
      });
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

  form.addEventListener('submit', function (ev) {
    // The live endpoint lives in data-endpoint, never in `action` - see the
    // comment on the <form> in index.html.
    var endpoint = (form.getAttribute('data-endpoint') || '').trim();
    ev.preventDefault();

    // No backend configured yet → hand off to a pre-filled email draft.
    if (!endpoint) {
      var data = new FormData(form);
      var subject = 'Morsel contact - ' + (data.get('topic') || 'General');
      var body =
        'Name: ' + (data.get('name') || '') + '\n' +
        'Email: ' + (data.get('email') || '') + '\n\n' +
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
