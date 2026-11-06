// The site bar and "On this page" panel for the hand-written pages. A page marks its sections with
// data-toc="Label" and an id; this builds the panel from them, lights the one you're reading, and on a
// narrow screen turns the panel into a drawer behind a Contents button.
(function () {
  const LINKS = [['Why', ''], ['The method', 'method/'], ['Ways', 'ways/'], ['New to this?', 'basics/'], ['Issue to Merge', 'issue-to-merge/']];
  const here = document.body.dataset.page || '';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  if (!document.querySelector('link[data-wc-fonts]')) {
    const f = document.createElement('link');
    f.rel = 'stylesheet'; f.dataset.wcFonts = '1';
    f.href = 'https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@900&family=Overpass:wght@400;700&family=Overpass+Mono:wght@600&display=swap';
    document.head.appendChild(f);
  }

  const bar = document.createElement('nav');
  bar.className = 'wc-bar'; bar.setAttribute('aria-label', 'Site');
  bar.innerHTML = `<div class="wc-in"><a class="wc-brand" href="../">ways</a>
    <button class="wc-toggle" type="button" aria-controls="wc-side" aria-expanded="false">Contents</button>
    <div class="wc-links">${LINKS.map(([l, h]) => `<a href="../${h}"${h === here ? ' aria-current="page"' : ''}>${esc(l)}</a>`).join('')}</div></div>`;
  document.body.prepend(bar);

  const secs = [...document.querySelectorAll('[data-toc][id]')];
  const side = document.createElement('aside');
  side.className = 'wc-side'; side.id = 'wc-side';
  side.innerHTML = `<nav aria-label="On this page"><div class="wc-head">On this page</div><ul>${
    secs.map(s => `<li><a href="#${s.id}">${esc(s.dataset.toc)}</a></li>`).join('')}</ul></nav>`;
  document.body.appendChild(side);
  document.body.classList.add('wc');

  const links = [...side.querySelectorAll('a')];
  const mark = id => links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
  const spy = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) mark(e.target.id); }), { rootMargin: '-30% 0px -60% 0px' });
  secs.forEach(s => spy.observe(s));

  const btn = bar.querySelector('.wc-toggle');
  const set = open => { document.body.classList.toggle('wc-open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => set(!document.body.classList.contains('wc-open')));
  links.forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
})();
