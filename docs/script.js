/* ============================================================
   anonymoustest137 — portfolio v2 engine (zero dependencies)
   ============================================================ */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TOUCH = matchMedia('(hover: none)').matches;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/* ---------- PRELOADER ---------- */
(function () {
  const num = document.getElementById('pnum'), fill = document.getElementById('pfill'),
        pre = document.getElementById('pre');
  document.body.classList.add('lock');
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(100, n + Math.random() * 14);
    num.textContent = String(Math.floor(n)).padStart(2, '0');
    fill.style.width = n + '%';
    if (n >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        pre.classList.add('done');
        document.body.classList.remove('lock');
        document.getElementById('nm').classList.add('go');
        startType();
      }, 260);
    }
  }, RM ? 20 : 110);
})();

/* ---------- SPLIT HERO NAME INTO CHARACTERS ---------- */
(function () {
  const mask = document.querySelector('#nm .mask');
  const txt = mask.textContent.trim();
  mask.innerHTML = '';
  [...txt].forEach((c, i) => {
    const s = document.createElement('span');
    s.className = 'ch';
    s.textContent = c === ' ' ? '\u00A0' : c;
    s.style.transitionDelay = (i * 35) + 'ms';
    mask.appendChild(s);
  });
})();

/* ---------- SMOOTH INERTIA SCROLL ---------- */
const smooth = document.getElementById('smooth');
let target = 0, current = 0, maxScroll = 0;

function sizeBody() {
  maxScroll = smooth.getBoundingClientRect().height - innerHeight;
  document.body.style.height = smooth.getBoundingClientRect().height + 'px';
}
if (!RM && !TOUCH) {
  smooth.style.position = 'fixed';
  smooth.style.top = '0';
  smooth.style.left = '0';
  smooth.style.width = '100%';
  sizeBody();
  addEventListener('resize', sizeBody);
  new ResizeObserver(sizeBody).observe(smooth);
}

/* ---------- CURSOR ---------- */
const dot = document.getElementById('dot'), ring = document.getElementById('ring');
let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
if (!TOUCH) {
  addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  }, { passive: true });
  document.querySelectorAll('a,button,.card,.sk,input,textarea')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hot'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hot'));
    });
}

/* ---------- MAGNETIC BUTTONS ---------- */
if (!TOUCH && !RM) {
  document.querySelectorAll('.mag').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* ---------- 3D TILT + SPOTLIGHT ---------- */
if (!TOUCH && !RM) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.style.perspective = '1000px';
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', (px * 100) + '%');
      card.style.setProperty('--my', (py * 100) + '%');
      card.style.transform =
        `perspective(1000px) rotateY(${(px - .5) * 9}deg) rotateX(${(.5 - py) * 9}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ---------- TYPING ---------- */
function startType() {
  const lines = ['Penetration Tester', 'Detection Engineer', 'Bug Bounty Hunter',
                 'AI Red Teamer', 'Security Researcher'];
  const el = document.getElementById('typed');
  let i = 0, c = 0, del = false;
  (function tick() {
    const t = lines[i];
    el.textContent = del ? t.slice(0, --c) : t.slice(0, ++c);
    let d = del ? 42 : 78;
    if (!del && c === t.length) { d = 1500; del = true; }
    else if (del && c === 0) { del = false; i = (i + 1) % lines.length; d = 280; }
    setTimeout(tick, d);
  })();
}

/* ---------- TEXT SCRAMBLE ---------- */
if (!RM) {
  const CH = '!<>-_\\/[]{}—=+*^?#01';
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const orig = el.textContent;
    let raf, frame = 0;
    el.addEventListener('mouseenter', () => {
      cancelAnimationFrame(raf); frame = 0;
      const q = [...orig].map(() => ({ r: Math.floor(Math.random() * 12) }));
      (function run() {
        let out = '';
        for (let i = 0; i < orig.length; i++) {
          if (frame > q[i].r + 8) out += orig[i];
          else if (frame > q[i].r) out += CH[Math.floor(Math.random() * CH.length)];
          else out += orig[i];
        }
        el.textContent = out;
        if (frame++ < 30) raf = requestAnimationFrame(run); else el.textContent = orig;
      })();
    });
  });
}

/* ---------- REVEALS ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('.rv,.rv-l,.rv-r,.line-mask,.term').forEach((el, i) => {
  if (el.parentElement.classList.contains('facts') ||
      el.parentElement.classList.contains('stats-row') ||
      el.parentElement.classList.contains('grid')) {
    el.style.transitionDelay = ((i % 6) * 80) + 'ms';
  }
  io.observe(el);
});

/* ---------- COUNTERS ---------- */
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.to;
  let n = 0;
  const step = Math.max(1, Math.ceil(end / 40));
  const iv = setInterval(() => {
    n += step;
    if (n >= end) { n = end; clearInterval(iv); }
    el.textContent = n + (end >= 100 ? '+' : '');
  }, 26);
  cio.unobserve(el);
}), { threshold: 0.6 });
document.querySelectorAll('[data-to]').forEach(el => cio.observe(el));

/* ---------- PROJECT FILTERS (FLIP) ---------- */
document.querySelectorAll('.filters button').forEach(btn => btn.onclick = () => {
  document.querySelectorAll('.filters button').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  const f = btn.dataset.f;
  const cards = [...document.querySelectorAll('.card')];
  const first = new Map(cards.map(c => [c, c.getBoundingClientRect()]));
  cards.forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.t !== f));
  if (RM) return;
  cards.forEach(c => {
    if (c.classList.contains('hide')) return;
    const a = first.get(c), b = c.getBoundingClientRect();
    const dx = a.left - b.left, dy = a.top - b.top;
    if (!dx && !dy) return;
    c.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: 'none' }],
              { duration: 520, easing: 'cubic-bezier(.16,1,.3,1)' });
  });
});

/* ---------- NAV ---------- */
const burger = document.getElementById('burger'), menu = document.getElementById('menu');
burger.onclick = () => menu.classList.toggle('open');
menu.querySelectorAll('a').forEach(a => a.onclick = () => menu.classList.remove('open'));

document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.querySelector(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  const y = t.getBoundingClientRect().top + (RM || TOUCH ? scrollY : target) - 70;
  if (RM || TOUCH) scrollTo({ top: y, behavior: 'smooth' });
  else target = clamp(y, 0, maxScroll);
}));

/* ---------- SKILLS RAIL + DOTS ---------- */
const rail = document.getElementById('rail'), pin = document.getElementById('pin'),
      dotsBox = document.getElementById('dots'), cards = [...document.querySelectorAll('.sk')];
cards.forEach(() => dotsBox.insertAdjacentHTML('beforeend', '<i></i>'));
const dotEls = [...dotsBox.children];

function railUpdate(scrollPos) {
  if (RM || innerWidth <= 980) return;
  const top = pin.offsetTop, h = pin.offsetHeight - innerHeight;
  const p = clamp((scrollPos - top) / h, 0, 1);
  const dist = rail.scrollWidth - innerWidth + window.innerWidth * 0.1;
  rail.style.transform = `translateX(${-p * Math.max(0, dist)}px)`;
  const mid = innerWidth / 2;
  let best = 0, bd = 1e9;
  cards.forEach((c, i) => {
    const r = c.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - mid);
    if (d < bd) { bd = d; best = i; }
    c.classList.toggle('mid', d < r.width * 0.62);
  });
  dotEls.forEach((d, i) => d.classList.toggle('on', i === best));
}
if (innerWidth <= 980 || RM) cards.forEach(c => c.classList.add('mid'));

/* ---------- TIMELINE DRAW ---------- */
const tl = document.getElementById('tl'), draw = document.getElementById('draw');
const jobs = [...document.querySelectorAll('.job')];
function tlUpdate() {
  if (!tl) return;
  const r = tl.getBoundingClientRect();
  const p = clamp((innerHeight * 0.75 - r.top) / r.height, 0, 1);
  const len = tl.offsetHeight;
  draw.style.setProperty('--len', len);
  draw.style.strokeDasharray = len;
  draw.style.strokeDashoffset = len * (1 - p);
  jobs.forEach(j => {
    const jr = j.getBoundingClientRect();
    j.classList.toggle('lit', jr.top < innerHeight * 0.75);
  });
}

/* ---------- PARALLAX + PROGRESS + RAF LOOP ---------- */
const prog = document.getElementById('prog');
const meshes = [
  { el: document.getElementById('mesh1'), s: 0.10 },
  { el: document.getElementById('mesh2'), s: -0.08 },
  { el: document.getElementById('mesh3'), s: 0.14 }
];
const ghost = document.querySelector('.ghost');
const heroIn = document.querySelector('.hero-in');
const header = document.getElementById('nav');
const secs = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('#menu a')];

function frame() {
  const real = (RM || TOUCH) ? scrollY : (target = clamp(target, 0, maxScroll));
  if (!RM && !TOUCH) {
    current = lerp(current, target, 0.085);
    if (Math.abs(current - target) < 0.05) current = target;
    smooth.style.transform = `translate3d(0,${-current}px,0)`;
  } else {
    current = scrollY;
  }

  // cursor ring
  if (!TOUCH) {
    rx = lerp(rx, mx, 0.16); ry = lerp(ry, my, 0.16);
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
  }

  // progress
  const mx2 = (RM || TOUCH) ? (document.documentElement.scrollHeight - innerHeight) : maxScroll;
  prog.style.width = clamp(current / (mx2 || 1), 0, 1) * 100 + '%';

  // header
  header.classList.toggle('stuck', current > 40);

  if (!RM) {
    // mesh parallax
    meshes.forEach(m => { if (m.el) m.el.style.transform = `translate3d(0,${current * m.s}px,0)`; });
    // hero layers
    if (ghost) ghost.style.transform = `translate(-50%,-50%) translateY(${current * 0.28}px)`;
    if (heroIn && current < innerHeight * 1.2) {
      const p = clamp(current / innerHeight, 0, 1);
      heroIn.style.transform = `translateY(${current * 0.14}px) scale(${1 - p * 0.08})`;
      heroIn.style.opacity = String(1 - p * 1.05);
      heroIn.style.filter = `blur(${p * 4}px)`;
    }
    // cursor-follow drift on hero
    if (!TOUCH && current < innerHeight) {
      const ox = (mx / innerWidth - .5) * 16, oy = (my / innerHeight - .5) * 10;
      if (ghost) ghost.style.marginLeft = ox + 'px', ghost.style.marginTop = oy + 'px';
    }
  }

  railUpdate(current);
  tlUpdate();

  // active nav
  let act = '';
  secs.forEach(s => {
    const r = s.getBoundingClientRect();
    if (r.top <= innerHeight * 0.4 && r.bottom >= innerHeight * 0.4) act = s.id;
  });
  navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + act));

  requestAnimationFrame(frame);
}

if (!RM && !TOUCH) {
  addEventListener('scroll', () => { target = scrollY; }, { passive: true });
}
requestAnimationFrame(frame);

/* ---------- MATRIX RAIN (throttled, pauses offscreen) ---------- */
(function () {
  if (RM) return;
  const c = document.getElementById('matrix'), x = c.getContext('2d', { alpha: true });
  const chars = '01アイウエオカキクABCDEF$#@%&*<>/\\|'.split('');
  let cols, drops, last = 0, visible = true;
  function size() {
    c.width = innerWidth; c.height = innerHeight;
    cols = Math.floor(c.width / 16);
    drops = Array(cols).fill(0).map(() => Math.random() * -100);
  }
  size(); addEventListener('resize', size);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });
  (function loop(t) {
    requestAnimationFrame(loop);
    if (!visible || t - last < 42) return;   // ~24fps cap
    last = t;
    x.fillStyle = 'rgba(5,7,10,0.09)';
    x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#00FF9C';
    x.font = '14px monospace';
    for (let i = 0; i < cols; i++) {
      x.fillText(chars[(Math.random() * chars.length) | 0], i * 16, drops[i] * 18);
      if (drops[i] * 18 > c.height && Math.random() > 0.972) drops[i] = 0;
      drops[i]++;
    }
  })(0);
})();

/* ---------- CONTACT ---------- */
document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const n = document.getElementById('n').value.trim();
  const out = document.getElementById('out');
  const msg = ['> encrypting payload... [OK]',
               '> opening secure channel... [OK]',
               `> transmission received. thanks, ${n} — I'll reply shortly.`];
  out.textContent = ''; let i = 0;
  (function print() {
    if (i >= msg.length) return;
    out.textContent += msg[i++] + '\n';
    setTimeout(print, 420);
  })();
  e.target.reset();
});

document.getElementById('yr').textContent = new Date().getFullYear();
