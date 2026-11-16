(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ----------------------------------------------------------
     追従ボタン：CTA・フッター付近では非表示にする
     ---------------------------------------------------------- */
  (function () {
    var buttons = document.querySelector('.js-fixed-buttons');
    var targets = document.querySelectorAll('#cta, .footer');
    if (!buttons || !targets.length || !hasIO) return;

    var visible = new Set();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      buttons.classList.toggle('is-hidden', visible.size > 0);
    });
    targets.forEach(function (el) { observer.observe(el); });
  })();

  /* ----------------------------------------------------------
     スクロール表示アニメーション
     [セレクタ, 種類(''|'pop'), 連続要素の時間差(秒)]
     ---------------------------------------------------------- */
  var revealTargets = [
    ['.about__title', '', 0],
    ['.about__list li', '', 0.15],
    ['.about__divider', '', 0],
    ['.about__answer', '', 0],
    ['.menu .section-title', '', 0],
    ['.menu-card', '', 0],
    ['.feature .section-title', '', 0],
    ['.feature-item__img', '', 0],
    ['.feature-item__body', '', 0],
    ['.feature-item__num', '', 0],
    ['.info__label', '', 0],
    ['.info__title', '', 0],
    ['.info__badge', 'pop', 0],
    ['.info__lead', '', 0],
    ['.info-card', '', 0],
    ['.info-card__steps li', '', 0.12],
    ['.info__inner > .btn--white', 'pop', 0],
    ['.cta__title', '', 0],
    ['.cta__lead', '', 0],
    ['.cta .btn--cta', 'pop', 0],
    ['.cta__notes', '', 0]
  ];

  revealTargets.forEach(function (t) {
    document.querySelectorAll(t[0]).forEach(function (el, i) {
      el.classList.add('js-reveal');
      if (t[1]) el.classList.add('js-reveal--' + t[1]);
      if (t[2]) el.style.setProperty('--delay', (i * t[2]).toFixed(2) + 's');
    });
  });

  // FEATURE：番号は本文より少し遅れて
  document.querySelectorAll('.feature-item__num').forEach(function (el) {
    el.style.setProperty('--delay', '0.3s');
  });

  var revealEls = document.querySelectorAll('.js-reveal');
  if (!hasIO || reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px' });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ----------------------------------------------------------
     泡・しずくを生成
     ---------------------------------------------------------- */
  if (reduceMotion) return;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  document.querySelectorAll('.bubbles').forEach(function (wrap) {
    var count = 16;
    var rise = wrap.parentElement.offsetHeight + 80;
    for (var i = 0; i < count; i++) {
      var b = document.createElement('span');
      var duration = rand(7, 14);
      b.className = 'bubble';
      b.style.left = rand(2, 96).toFixed(1) + '%';
      b.style.setProperty('--size', rand(6, 22).toFixed(1) + 'px');
      b.style.setProperty('--duration', duration.toFixed(2) + 's');
      b.style.setProperty('--delay', (-rand(0, duration)).toFixed(2) + 's');
      b.style.setProperty('--sway', rand(6, 18).toFixed(1) + 'px');
      b.style.setProperty('--rise', rise + 'px');
      wrap.appendChild(b);
    }
  });
})();
