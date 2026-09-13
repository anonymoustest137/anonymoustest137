// ---------- Matrix rain ----------
(function () {
  const c = document.getElementById('matrix'), x = c.getContext('2d');
  const chars = '01アイウエオカキクabcdef$#@%&*<>/\\|'.split('');
  let cols, drops;
  function size() {
    c.width = innerWidth; c.height = innerHeight;
    cols = Math.floor(c.width / 14);
    drops = Array(cols).fill(1);
  }
  size(); addEventListener('resize', size);
  setInterval(() => {
    x.fillStyle = 'rgba(5,8,7,0.08)'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#00ff41'; x.font = '14px monospace';
    drops.forEach((y, i) => {
      x.fillText(chars[(Math.random() * chars.length) | 0], i * 14, y * 16);
      if (y * 16 > c.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }, 55);
})();

// ---------- Typing effect ----------
(function () {
  const lines = ['Penetration Tester', 'Network Security Explorer', 'Ethical Hacker',
    'Bug Bounty Hunter', 'Security Researcher', 'AI Red Teamer'];
  const el = document.getElementById('typed');
  let li = 0, ci = 0, del = false;
  (function tick() {
    const t = lines[li];
    el.textContent = del ? t.slice(0, --ci) : t.slice(0, ++ci);
    let d = del ? 45 : 85;
    if (!del && ci === t.length) { d = 1400; del = true; }
    else if (del && ci === 0) { del = false; li = (li + 1) % lines.length; d = 300; }
    setTimeout(tick, d);
  })();
})();

// ---------- Scroll reveal ----------
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(e => io.observe(e));

// ---------- Counters ----------
(function () {
  const nums = document.querySelectorAll('[data-count]');
  const o = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count;
    let n = 0, step = Math.max(1, Math.ceil(end / 45));
    const id = setInterval(() => {
      n += step; if (n >= end) { n = end; clearInterval(id); }
      el.textContent = n + (end >= 100 ? '+' : '');
    }, 28);
    o.unobserve(el);
  }), { threshold: .5 });
  nums.forEach(n => o.observe(n));
})();

// ---------- Project filters ----------
document.querySelectorAll('.filters button').forEach(b => b.onclick = () => {
  document.querySelectorAll('.filters button').forEach(x => x.classList.remove('active'));
  b.classList.add('active');
  const f = b.dataset.f;
  document.querySelectorAll('.proj').forEach(p =>
    p.classList.toggle('hide', f !== 'all' && p.dataset.tag !== f));
});

// ---------- Mobile nav ----------
const burger = document.getElementById('burger'), nav = document.querySelector('nav');
burger.onclick = () => nav.classList.toggle('open');
nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));

// ---------- Contact (front-end demo) ----------
function handleSend(e) {
  e.preventDefault();
  const n = document.getElementById('f-name').value.trim();
  document.getElementById('f-out').textContent =
    `> transmission encrypted. thanks, ${n} — I'll reply shortly.`;
  e.target.reset();
  return false;
}

document.getElementById('yr').textContent = new Date().getFullYear();
