(function () {
  'use strict';

  // шлях до кореня сайту (працює і з /, і з /en/)
  var BASE = document.currentScript.src.replace(/js\/main\.js.*$/, '');
  var LANG = document.documentElement.lang === 'en' ? 'en' : 'de';
  var T = {
    de: { slide: 'Bild ', close: 'Schliessen',
          thanks: 'Vielen Dank!', sent: 'Ihre Anmeldung ist eingegangen. Wir melden uns in Kürze per E-Mail bei Ihnen.' },
    en: { slide: 'Image ', close: 'Close',
          thanks: 'Thank you!', sent: 'Your registration has been received. We will contact you by email shortly.' }
  }[LANG];

  /* ---------- Mobile menu ---------- */
  var menu = document.querySelector('[data-mobile-menu]');
  var burger = document.querySelector('[data-burger]');
  var burgerClose = document.querySelector('[data-burger-close]');

  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    burger.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
  }
  burger.addEventListener('click', function () { setMenu(true); });
  burgerClose.addEventListener('click', function () { setMenu(false); });
  menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });

  /* ---------- Language dropdown ---------- */
  document.querySelectorAll('[data-lang]').forEach(function (lang) {
    var toggle = lang.querySelector('.lang__toggle');
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !lang.classList.contains('is-open');
      lang.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('[data-lang].is-open').forEach(function (l) {
      l.classList.remove('is-open');
      l.querySelector('.lang__toggle').setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Program accordion ---------- */
  document.querySelectorAll('[data-accordion] .acc-item').forEach(function (item) {
    var head = item.querySelector('.acc-item__head');
    head.addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      head.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Speaker sliders ---------- */
  document.querySelectorAll('[data-slider]').forEach(function (slider) {
    var slides = slider.querySelectorAll('.slider__slide');
    var dotsWrap = slider.querySelector('.slider__dots');
    var prev = slider.querySelector('.slider__btn--prev');
    var next = slider.querySelector('.slider__btn:not(.slider__btn--prev)');
    var index = 0;
    var dots = [];

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'slider__dot';
      dot.setAttribute('aria-label', T.slide + (i + 1));
      dot.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === index); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === index); });
      prev.disabled = slides.length < 2 || index === 0;
    }
    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });

    // свайп на мобільних
    var startX = null;
    slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });
    go(0);
  });

  /* ---------- Cookies ---------- */
  var cookies = document.querySelector('[data-cookies]');
  var COOKIE_KEY = 'sdds-cookie-consent';
  var consent = null;
  try { consent = localStorage.getItem(COOKIE_KEY); } catch (e) {}
  if (!consent) cookies.hidden = false;

  function hideCookies(value) {
    if (value) { try { localStorage.setItem(COOKIE_KEY, value); } catch (e) {} }
    cookies.classList.add('is-hiding');
    setTimeout(function () { cookies.hidden = true; }, 300);
  }
  cookies.querySelectorAll('[data-cookies-accept]').forEach(function (btn) {
    btn.addEventListener('click', function () { hideCookies(btn.getAttribute('data-cookies-accept')); });
  });
  cookies.querySelector('[data-cookies-close]').addEventListener('click', function () { hideCookies(null); });

  /* ---------- Video modal ---------- */
  // Вкажіть посилання на відео (mp4 або embed YouTube/Vimeo) — до того показується заставка з макета
  var VIDEO_SRC = '';
  var videoBtn = document.querySelector('[data-video-open]');
  var modal = document.createElement('div');
  modal.className = 'modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML =
    '<div class="modal__box">' +
      '<button class="modal__close" type="button" aria-label="' + T.close + '"></button>' +
      '<div class="modal__poster">' +
        '<img class="modal__logo" src="' + BASE + 'assets/icons/logo-white.svg" alt="Swiss Dental Design Studio">' +
        '<span class="play__inner"><img src="' + BASE + 'assets/icons/play.svg" alt="" width="28" height="28"></span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(modal);
  var box = modal.querySelector('.modal__box');

  function openVideo() {
    if (VIDEO_SRC && !box.querySelector('video, iframe')) {
      var isFile = /\.(mp4|webm)(\?|$)/i.test(VIDEO_SRC);
      var el = document.createElement(isFile ? 'video' : 'iframe');
      el.src = VIDEO_SRC;
      if (isFile) { el.controls = true; el.autoplay = true; }
      else { el.allow = 'autoplay; fullscreen'; el.allowFullscreen = true; }
      box.appendChild(el);
    }
    modal.classList.add('is-open');
    document.body.classList.add('menu-open');
  }
  function closeVideo() {
    modal.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    var media = box.querySelector('video, iframe');
    if (media) media.remove();
  }
  videoBtn.addEventListener('click', openVideo);
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.classList.contains('modal__close')) closeVideo();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (modal.classList.contains('is-open')) closeVideo();
    if (menu.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Registration form ---------- */
  var form = document.querySelector('[data-form]');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (input) {
      var wrap = input.closest('.field, .checkbox');
      var ok = input.type === 'checkbox' ? input.checked : input.checkValidity() && input.value.trim() !== '';
      wrap.classList.toggle('is-invalid', !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      var first = form.querySelector('.is-invalid input, .is-invalid textarea');
      if (first) first.focus();
      return;
    }
    // TODO: підключити відправку (fetch на бекенд / CRM) і редірект на сторінку підтвердження
    form.innerHTML = '<h2 class="form__title">' + T.thanks + '</h2>' +
      '<p class="form__success">' + T.sent + '</p>';
  });
  form.addEventListener('input', function (e) {
    var wrap = e.target.closest('.is-invalid');
    if (wrap) wrap.classList.remove('is-invalid');
  });
})();
