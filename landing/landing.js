// Лендинг: живой веер (настройка → ран → результат), голос, подсказка языка, клики в GoatCounter.
// Страница читается и без этого скрипта: в разметке уже стоит кадр «0:12, раунд 3 из 8».
(function () {
  var T = window.FITMER_T || {};
  var lang = document.body.getAttribute('data-lang') || 'en';
  var ch = document.body.getAttribute('data-ch') || 'site';
  var GC = 'https://fitmer.goatcounter.com/count';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function beacon(path) {
    try {
      var url = GC + '?p=' + encodeURIComponent('/' + ch + '/' + path);
      if (navigator.sendBeacon) navigator.sendBeacon(url); else new Image().src = url;
    } catch (e) {}
  }
  beacon('view');
  document.querySelectorAll('[data-gc]').forEach(function (a) {
    a.addEventListener('click', function () { beacon(a.getAttribute('data-gc')); });
  });

  // Подсказка «есть русская версия» / «English version» по языку браузера, без автоперехода.
  var ruBrowser = /^(ru|uk|be|kk)\b/i.test(navigator.language || '');
  if ((lang === 'en' && ruBrowser) || (lang === 'ru' && !ruBrowser)) {
    var hint = document.getElementById('lang-hint');
    if (hint) hint.classList.add('on');
  }

  // Список языков: отмечаем текущий, закрываем по клику мимо и по Esc.
  var langBox = document.getElementById('lang');
  if (langBox) {
    var cur = langBox.querySelector('a[hreflang="' + lang + '"]');
    if (cur) cur.setAttribute('aria-current', 'page');
    document.addEventListener('click', function (e) { if (!langBox.contains(e.target)) langBox.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') langBox.open = false; });
  }

  // Телефон: липкая кнопка стора под платформу, пока кнопки hero и финала не на экране.
  var mbar = document.getElementById('mbar');
  var ua = navigator.userAgent || '';
  var isAndroid = /android/i.test(ua);
  var isIOS = !isAndroid && (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
  if (mbar && (isIOS || isAndroid) && 'IntersectionObserver' in window) {
    if (isAndroid) { mbar.href = mbar.getAttribute('data-android'); document.getElementById('mbar-t').textContent = T.mbar_android; }
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
      mbar.hidden = visible.size > 0;
    });
    document.querySelectorAll('.stores').forEach(function (s) { io.observe(s); });
  }

  // Голос: тот же пак, что на /start (site/start/snd).
  var play = document.getElementById('voice-play');
  if (play) play.addEventListener('click', function () {
    var seq = ['3', '2', '1', 'work'], i = 0;
    beacon('voice');
    (function next() {
      if (i >= seq.length) return;
      var a = new Audio('/start/snd/' + lang + '/' + seq[i++] + '.mp3');
      a.onended = function () { setTimeout(next, 120); };
      a.play().catch(function () {});
    })();
  });

  var fan = document.getElementById('fan');
  if (!fan) return;

  // Цвета фаз и фон берём из токенов текущей темы веера (CSS-переменные на .fan).
  var PAL = {};
  function readPalette() {
    var cs = getComputedStyle(fan);
    var v = function (n) { return cs.getPropertyValue(n).trim(); };
    PAL = { ground: v('--ground'), work: v('--brand'), rest: v('--rest'), prepare: v('--prepare') };
  }
  function rgba(hex, a) {
    var n = parseInt(hex.replace('#', ''), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  readPalette();

  // Переключатель тем под веером: перекрашивает все три телефона.
  document.querySelectorAll('.theme-sw button').forEach(function (b) {
    b.addEventListener('click', function () {
      fan.setAttribute('data-theme', b.getAttribute('data-theme'));
      document.querySelectorAll('.theme-sw button').forEach(function (o) { o.setAttribute('aria-checked', String(o === b)); });
      readPalette();
      if (runScreen) { lastPhase = ''; render(); }
      beacon('theme-' + b.getAttribute('data-theme'));
    });
  });
  if (reduce) return;
  var PACE = [78, 82, 80, 85, 84, 88, 86, 90, 87, 92, 89, 91, 88, 94];
  var s = { work: 20, rest: 10, rounds: 8, round: 3, phase: 'work', left: 120, tick: 0, result: 0 };

  var el = function (id) { return document.getElementById(id); };
  var runScreen = el('run-screen'), runApp = el('run-app'), glow = el('glow');
  var label = el('r-label'), time = el('r-time'), left = el('r-left'), next = el('r-next'), pips = el('r-pips'), ring = el('r-ring');
  var sWork = el('s-work'), sTotal = el('s-total'), sPlus = el('s-plus'), sMinus = el('s-minus');
  var rNum = el('r-num'), rCap = el('r-cap'), bars = el('r-bars');
  var C = 2 * Math.PI * 52;

  for (var b = 0; b < PACE.length; b++) bars.appendChild(document.createElement('i'));
  var barEls = bars.children;

  function fmt(n) { return Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0'); }
  function digits(str) {
    return str.split('').map(function (d) { return d === ':' ? '<i class="c">:</i>' : '<i>' + d + '</i>'; }).join('');
  }

  var lastTime = '', lastRound = -1, lastRounds = -1, lastPhase = '';
  function render() {
    var secs = Math.ceil(s.left / 10);
    var dur = s.phase === 'work' ? s.work * 10 : s.phase === 'rest' ? s.rest * 10 : 30;
    var col = PAL[s.phase];
    if (lastPhase !== s.phase) {
      lastPhase = s.phase;
      // Как running_chrome.dart: ground + цвет фазы 10 %; кнопка паузы и кольцо — цвет фазы.
      var tint = rgba(col, 0.10);
      runScreen.style.background = 'linear-gradient(' + tint + ',' + tint + '), ' + PAL.ground;
      runApp.style.setProperty('--ph', col);
      runApp.style.setProperty('--next', s.phase === 'work' ? PAL.rest : PAL.work);
      glow.style.setProperty('--glow', rgba(col, 0.2));
      label.textContent = s.phase === 'work' ? T.p_work : s.phase === 'rest' ? T.p_rest : T.p_prepare;
      next.textContent = s.phase === 'work' ? T.p_rest + ' · ' + fmt(s.rest) : T.p_work + ' · ' + fmt(s.work);
    }
    var t = fmt(secs);
    if (t !== lastTime) { time.innerHTML = digits(t); lastTime = t; }
    var cycle = s.work + s.rest, total;
    if (s.phase === 'prepare') total = secs + s.rounds * cycle;
    else if (s.phase === 'work') total = secs + s.rest + (s.rounds - s.round) * cycle;
    else total = secs + (s.rounds - s.round) * cycle;
    left.textContent = fmt(total);
    ring.setAttribute('stroke-dashoffset', (C * (s.left / dur)).toFixed(1));
    if (lastRound !== s.round || lastRounds !== s.rounds) {
      lastRound = s.round; lastRounds = s.rounds;
      var html = '';
      for (var i = 1; i <= s.rounds; i++) html += '<i class="' + (i < s.round ? 'done' : i === s.round ? 'cur' : '') + '"></i>';
      pips.innerHTML = html;
    }
    sWork.textContent = fmt(s.work);
    sTotal.textContent = fmt(s.rounds * cycle);
    rNum.textContent = String(s.result);
    rCap.textContent = s.result >= 14 ? T.r_best : T.r_counting;
    for (var k = 0; k < barEls.length; k++) {
      var shown = k < s.result;
      barEls[k].style.height = shown ? ((PACE[k] - 70) / 24 * 100) + '%' : '0';
      barEls[k].className = s.result >= 14 ? (k === 0 ? 'best' : k === 13 ? 'worst' : '') : '';
    }
  }

  function step() {
    s.tick++;
    if (s.left > 1) s.left--;
    else if (s.phase === 'prepare') { s.phase = 'work'; s.left = s.work * 10; }
    else if (s.phase === 'work') { s.phase = 'rest'; s.left = s.rest * 10; }
    else if (s.round >= s.rounds) { s.phase = 'prepare'; s.round = 1; s.left = 30; }
    else { s.phase = 'work'; s.round++; s.left = s.work * 10; }
    // Настройка «нажимает» + дважды, потом − дважды, раз в 3,2 с.
    var t = s.tick % 32;
    if (t === 0) {
      var up = Math.floor(s.tick / 32) % 4 < 2;
      s.work = Math.max(10, Math.min(60, s.work + (up ? 5 : -5)));
      (up ? sPlus : sMinus).classList.add('press');
      lastPhase = '';
    } else if (t === 3) { sPlus.classList.remove('press'); sMinus.classList.remove('press'); }
    // Результат: 0 → 14 раундов, пауза, заново.
    var r = s.tick % 80;
    s.result = r < 42 ? Math.min(14, Math.floor(r / 3)) : 14;
    render();
  }

  // Анимация только пока веер на экране.
  var timer = null;
  function start() { if (!timer) timer = setInterval(step, 100); }
  function stop() { clearInterval(timer); timer = null; }
  render();
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { e[0].isIntersecting ? start() : stop(); }).observe(fan);
  } else start();
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
})();
