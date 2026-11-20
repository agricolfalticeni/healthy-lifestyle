/* =========================================================
   Healthy Lifestyle — interactions
   ========================================================= */
(() => {
  'use strict';

  /* ---------- data ---------- */
  // Product photos live in the local "images/" folder next to index.html.
  const BASE = 'images/';
  const EMAIL = 'fe_healthylfe@yahoo.com';

  const RANGES = {
    tea:   { label: 'Tea',    size: '20 g',   price: 3, dot: 'var(--cat-tea)',
             desc: 'A natural infusion of wild plants and forest fruit, collected in Bucovina and gently dried. Simply add hot water and enjoy.' },
    syrup: { label: 'Syrup',  size: '200 ml', price: 5, dot: 'var(--cat-syrup)',
             desc: 'Forest fruit and plants from Bucovina turned into a 100% natural syrup. Delicious in water, tea or desserts.' },
    jam:   { label: 'Jam',    size: '120 g',  price: 4, dot: 'var(--cat-jam)',
             desc: 'Wild berries and plants from Bucovina, made into jam and jelly. A spoonful of the forest for your breakfast.' },
  };

  const PRODUCTS = [
    ['healthy-tea',        'Healthy Tea',          'tea',   'healthy_tea.jpg'],
    ['rosehip-tea',        'Rosehip Tea',          'tea',   'rosehip_tea.jpeg'],
    ['elderberry-tea',     'Elderberry Tea',       'tea',   'elderberry_tea.jpeg'],
    ['sea-buckthorn-tea',  'Sea Buckthorn Tea',    'tea',   'sea_buckthorn_tea.jpg'],
    ['cranberry-tea',      'Cranberry Tea',        'tea',   'cranberries_tea.jpeg'],
    ['wild-thyme-tea',     'Wild Thyme Tea',       'tea',   'wild_thyme_tea.jpeg'],
    ['blueberry-tea',      'Blueberry Tea',        'tea',   'blueberry_tea.jpeg'],
    ['fir-buds-tea',       'Fir Buds Tea',         'tea',   'fir_buds_tea.jpg'],
    ['wild-mint-tea',      'Wild Mint Tea',        'tea',   'wild_mint_tea.jpg'],
    ['blueberry-syrup',    'Blueberry Syrup',      'syrup', 'sea_buckthorn_syrup.jpg'],
    ['sea-buckthorn-syrup','Sea Buckthorn Syrup',  'syrup', 'seee_buckthorn_syrup.jpg'],
    ['cranberry-syrup',    'Cranberry Syrup',      'syrup', 'rosehip_syrup.jpg'],
    ['rosehip-syrup',      'Rosehip Syrup',        'syrup', 'rosehip_syrup.jpg'],
    ['wild-thyme-syrup',   'Wild Thyme Syrup',     'syrup', 'wild_thyme_syrup.jpg'],
    ['fir-buds-syrup',     'Fir Buds Syrup',       'syrup', 'fir_buds_syrup.jpg'],
    ['elderberry-syrup',   'Elderberry Syrup',     'syrup', 'elderberry_syrup.jpg'],
    ['wild-raspberry-jam', 'Wild Raspberry Jam',   'jam',   'wild_raspberry_jam.jpg'],
    ['blackberry-jam',     'Blackberry Jam',       'jam',   'blackberry_jam.jpg'],
    ['dandelion-jelly',    'Dandelion Jelly with Wormwood', 'jam', 'dandelion_jelly.jpg'],
    ['red-currant-jelly',  'Red Currant Jelly',    'jam',   'red.jpg'],
    ['black-currant-jelly','Black Currant Jelly',  'jam',   'IMG-20241109-WA0017.jpg'],
    ['blueberry-jam',      'Blueberry Jam',        'jam',   'blak.jpg'],
  ].map(([id, name, cat, file]) => ({ id, name, cat, img: BASE + file, size: RANGES[cat].size, price: RANGES[cat].price }));

  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => '€' + (Number.isInteger(n) ? n : n.toFixed(2));
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(pointer: fine)').matches;
  const storage = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const icon = (id, cls = '') => `<svg class="i ${cls}"><use href="#${id}"/></svg>`;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const metaTheme = $('meta[name="theme-color"]');
  const syncThemeMeta = () => { metaTheme.content = root.dataset.theme === 'dark' ? '#0B1510' : '#F3F0E6'; };
  syncThemeMeta();
  $('#themeBtn').addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('hl-theme', root.dataset.theme); } catch {}
    syncThemeMeta();
  });

  /* ---------- header, progress, active link ---------- */
  const header = $('#header');
  const progress = $('#progress');
  let ticking = false;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('scrolled', y > 24);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    updateStatement();
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  const navLinks = $$('.nav-links a');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  /* ---------- mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const mobileMenu = $('#mobileMenu');
  const setMenu = open => {
    root.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    mobileMenu.toggleAttribute('inert', !open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('lock', open);
  };
  menuBtn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  $$('a', mobileMenu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- reveal on scroll ---------- */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealer.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  $$('[data-reveal]').forEach(el => revealer.observe(el));

  /* ---------- counters ---------- */
  const counter = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      counter.unobserve(e.target);
      const el = e.target, end = +el.dataset.count, suffix = el.dataset.suffix || '';
      const start = el.hasAttribute('data-plain') ? Math.round(end * .985) : 0;
      if (reduceMotion) return;
      const t0 = performance.now(), dur = 1600;
      const step = t => {
        const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 4);
        el.textContent = Math.round(start + (end - start) * eased) + suffix;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(el => counter.observe(el));

  /* ---------- scroll-highlighted statement ---------- */
  const statement = $('#statement');
  const words = [];
  (function splitWords(node) {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'w'; s.textContent = part;
          words.push(s); frag.appendChild(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        splitWords(child);
      }
    });
  })(statement);
  function updateStatement() {
    if (reduceMotion) return;
    const r = statement.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * .88 - r.top) / (r.height + innerHeight * .35)));
    const n = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < n));
  }
  if (reduceMotion) words.forEach(w => w.classList.add('on'));

  /* ---------- marquee (duplicate for seamless loop) ---------- */
  const marquee = $('#marquee');
  marquee.innerHTML += marquee.innerHTML;

  /* ---------- hero parallax ---------- */
  const heroVisual = $('#heroVisual');
  if (finePointer && !reduceMotion) {
    const layers = $$('[data-depth]', heroVisual);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      layers.forEach(l => { const d = +l.dataset.depth; l.style.translate = `${(cx * d).toFixed(2)}px ${(cy * d).toFixed(2)}px`; });
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .001 ? requestAnimationFrame(loop) : 0;
    };
    $('.hero').addEventListener('pointermove', e => {
      tx = e.clientX / innerWidth - .5; ty = e.clientY / innerHeight - .5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    $('.hero').addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- store grid ---------- */
  const grid = $('#grid');
  const filters = $('#filters');
  const indicator = $('.seg-indicator', filters);
  const search = $('#search');
  const emptyState = $('#emptyState');
  let activeCat = 'all';

  $$('button', filters).forEach(b => {
    const c = b.dataset.cat;
    $('.count', b).textContent = c === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.cat === c).length;
  });

  const cardHTML = (p, i) => `
    <article class="p-card" style="--d:${Math.min(i, 12) * 45}ms">
      <div class="p-media">
        <img src="${p.img}" alt="${p.name}, ${p.size}" loading="lazy" decoding="async" width="1200" height="1600">
        <span class="tag" style="--dot:${RANGES[p.cat].dot}">${RANGES[p.cat].label}</span>
        <button class="p-open" type="button" data-open="${p.id}" aria-label="View details for ${p.name}"></button>
        <button class="p-add" type="button" data-add="${p.id}" aria-label="Add ${p.name} to cart">${icon('i-plus', 'i-plus')}${icon('i-check', 'i-check')}</button>
      </div>
      <div class="p-info">
        <div>
          <h3 class="p-name"><button type="button" data-open="${p.id}">${p.name}</button></h3>
          <p class="p-size">${p.size}</p>
        </div>
        <span class="p-price">${money(p.price)}</span>
      </div>
    </article>`;

  function renderGrid() {
    const q = search.value.trim().toLowerCase();
    const list = PRODUCTS.filter(p =>
      (activeCat === 'all' || p.cat === activeCat) &&
      (!q || p.name.toLowerCase().includes(q) || RANGES[p.cat].label.toLowerCase().includes(q)));
    grid.innerHTML = list.map(cardHTML).join('');
    emptyState.hidden = list.length > 0;
    $('#emptyQuery').textContent = search.value.trim();
  }

  function moveIndicator() {
    const b = $('[aria-selected="true"]', filters);
    indicator.style.width = b.offsetWidth + 'px';
    indicator.style.transform = `translateX(${b.offsetLeft}px)`;
  }

  function setCategory(cat) {
    activeCat = cat;
    $$('button', filters).forEach(b => b.setAttribute('aria-selected', String(b.dataset.cat === cat)));
    moveIndicator();
    renderGrid();
  }

  filters.addEventListener('click', e => { const b = e.target.closest('button'); if (b) setCategory(b.dataset.cat); });
  search.addEventListener('input', renderGrid);
  $('#clearSearch').addEventListener('click', () => { search.value = ''; setCategory('all'); search.focus(); });
  addEventListener('resize', moveIndicator);
  if (document.fonts) document.fonts.ready.then(moveIndicator);
  $$('[data-filter]').forEach(a => a.addEventListener('click', () => { search.value = ''; setCategory(a.dataset.filter); }));

  grid.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const img = $('img', add.closest('.p-media'));
      addToCart(add.dataset.add, 1, img);
      add.classList.add('added');
      clearTimeout(add._t);
      add._t = setTimeout(() => add.classList.remove('added'), 1300);
      return;
    }
    const open = e.target.closest('[data-open]');
    if (open) openQuickView(open.dataset.open);
  });

  /* ---------- quick view ---------- */
  const qv = $('#quickView');
  let qvProduct = null, qvQty = 1;
  const updateQv = () => {
    $('#qvQty').textContent = qvQty;
    $('#qvTotal').textContent = money(qvProduct.price * qvQty);
  };
  function openQuickView(id) {
    qvProduct = byId[id]; qvQty = 1;
    const r = RANGES[qvProduct.cat];
    $('#qvImg').src = qvProduct.img;
    $('#qvImg').alt = qvProduct.name;
    $('#qvCat').textContent = r.label;
    $('#qvCat').style.setProperty('--dot', r.dot);
    $('#qvName').textContent = qvProduct.name;
    $('#qvPrice').textContent = money(qvProduct.price);
    $('#qvSize').textContent = qvProduct.size;
    $('#qvDesc').textContent = r.desc;
    updateQv();
    qv.showModal();
    document.body.classList.add('lock');
  }
  qv.addEventListener('close', () => { if (!drawer.classList.contains('open')) document.body.classList.remove('lock'); });
  qv.addEventListener('click', e => { if (e.target === qv || e.target.closest('[data-close-qv]')) qv.close(); });
  $$('[data-step]', qv).forEach(b => b.addEventListener('click', () => {
    qvQty = Math.max(1, Math.min(99, qvQty + +b.dataset.step)); updateQv();
  }));
  $('#qvAdd').addEventListener('click', () => {
    addToCart(qvProduct.id, qvQty, $('#qvImg'));
    qv.close();
  });

  /* ---------- cart ---------- */
  const cartBtn = $('#cartBtn');
  const drawer = $('#drawer');
  const scrim = $('#scrim');
  let cart = storage.get('hl-cart', {});
  if (typeof cart !== 'object' || cart === null || Array.isArray(cart)) cart = {};
  Object.keys(cart).forEach(id => { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; else cart[id] = Math.min(99, Math.floor(cart[id])); });

  const cartLines = () => Object.keys(cart).map(id => ({ p: byId[id], qty: cart[id] }));
  const cartCount = () => cartLines().reduce((a, l) => a + l.qty, 0);
  const cartTotal = () => cartLines().reduce((a, l) => a + l.qty * l.p.price, 0);

  function setQty(id, qty) {
    if (qty <= 0) delete cart[id]; else cart[id] = Math.min(99, qty);
    storage.set('hl-cart', cart);
    renderCart();
  }

  function addToCart(id, qty = 1, fromImg) {
    setQty(id, (cart[id] || 0) + qty);
    if (fromImg) fly(fromImg);
    else bump();
    toast({ img: byId[id].img, html: `<b>${byId[id].name}</b>${qty > 1 ? ' ×' + qty : ''} added to your cart`, action: 'View', onAction: () => openDrawer() });
  }

  function bump() {
    cartBtn.classList.remove('bump'); void cartBtn.offsetWidth; cartBtn.classList.add('bump');
  }

  function fly(img) {
    if (reduceMotion) return bump();
    const r = img.getBoundingClientRect(), t = cartBtn.getBoundingClientRect();
    if (!r.width) return bump();
    const c = document.createElement('img');
    c.src = img.currentSrc || img.src; c.className = 'fly'; c.alt = '';
    Object.assign(c.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px' });
    document.body.appendChild(c);
    const dx = t.left + t.width / 2 - (r.left + r.width / 2);
    const dy = t.top + t.height / 2 - (r.top + r.height / 2);
    c.animate([
      { transform: 'translate(0,0) scale(1) rotate(0)', opacity: 1, borderRadius: '22px' },
      { transform: `translate(${dx * .45}px, ${dy * .45 - 90}px) scale(.45) rotate(-8deg)`, opacity: 1, offset: .55 },
      { transform: `translate(${dx}px, ${dy}px) scale(.06) rotate(10deg)`, opacity: .4, borderRadius: '50%' },
    ], { duration: 850, easing: 'cubic-bezier(.55,0,.25,1)' }).onfinish = () => { c.remove(); bump(); };
  }

  function renderCart() {
    const lines = cartLines();
    $('#cartCount').textContent = cartCount();
    cartBtn.setAttribute('aria-label', `Open cart, ${cartCount()} item${cartCount() === 1 ? '' : 's'}`);
    $('#subtotal').textContent = money(cartTotal());
    $('#checkoutTotal').textContent = money(cartTotal());
    $('#toCheckout').disabled = !lines.length;

    $('#cartItems').innerHTML = lines.length ? lines.map(({ p, qty }) => `
      <div class="c-item" data-id="${p.id}">
        <img src="${p.img}" alt="" loading="lazy">
        <div>
          <p class="c-name">${p.name}</p>
          <p class="c-meta">${p.size} · ${money(p.price)} each</p>
          <div class="c-ctrl">
            <div class="stepper">
              <button type="button" data-act="dec" aria-label="Decrease ${p.name}">${icon('i-minus')}</button>
              <output>${qty}</output>
              <button type="button" data-act="inc" aria-label="Increase ${p.name}">${icon('i-plus')}</button>
            </div>
            <button type="button" class="c-remove" data-act="remove">Remove</button>
          </div>
        </div>
        <span class="c-line">${money(p.price * qty)}</span>
      </div>`).join('') : `
      <div class="cart-empty">
        <span class="em-ico">${icon('i-leaf')}</span>
        <h4>Your cart is empty</h4>
        <p>Add a tea, syrup or jam from the store.</p>
        <button class="btn btn-primary" type="button" data-act="browse">Browse the store ${icon('i-arrow')}</button>
      </div>`;

    $('#orderSummary').innerHTML = lines.map(({ p, qty }) =>
      `<div><span>${qty} × ${p.name}</span><b>${money(p.price * qty)}</b></div>`).join('');

    if (!lines.length && drawer.dataset.view === 'checkout') drawer.dataset.view = 'cart';
  }

  $('#cartItems').addEventListener('click', e => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'browse') { closeDrawer(); location.hash = '#store'; return; }
    const id = b.closest('.c-item').dataset.id;
    if (b.dataset.act === 'inc') setQty(id, cart[id] + 1);
    if (b.dataset.act === 'dec') setQty(id, cart[id] - 1);
    if (b.dataset.act === 'remove') setQty(id, 0);
  });

  /* drawer open / close */
  let lastFocus = null;
  function setView(v) {
    drawer.dataset.view = v;
    $('#drawerTitle').textContent = v === 'checkout' ? 'Checkout' : v === 'done' ? 'Order placed' : 'Your cart';
  }
  function openDrawer(view = 'cart') {
    lastFocus = document.activeElement;
    setView(view);
    drawer.classList.add('open'); scrim.classList.add('open');
    drawer.removeAttribute('inert'); drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    setTimeout(() => $('#closeDrawer').focus({ preventScroll: true }), 50);
  }
  function closeDrawer() {
    drawer.classList.remove('open'); scrim.classList.remove('open');
    drawer.setAttribute('inert', ''); drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (drawer.dataset.view === 'done') setTimeout(() => setView('cart'), 600);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  cartBtn.addEventListener('click', () => openDrawer());
  $('#closeDrawer').addEventListener('click', closeDrawer);
  scrim.addEventListener('click', closeDrawer);
  $('#toCheckout').addEventListener('click', () => setView('checkout'));
  $('#backToCart').addEventListener('click', () => setView('cart'));
  $('#keepShopping').addEventListener('click', () => { closeDrawer(); location.hash = '#store'; });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('open')) closeDrawer();
    else if (root.classList.contains('menu-open')) setMenu(false);
  });

  /* checkout */
  const checkoutForm = $('#checkoutForm');
  checkoutForm.addEventListener('submit', e => {
    e.preventDefault();
    const fields = $$('input, textarea', checkoutForm);
    let firstBad = null;
    fields.forEach(f => {
      const bad = !f.checkValidity();
      f.classList.toggle('invalid', bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) { firstBad.focus(); firstBad.reportValidity(); return; }
    const data = Object.fromEntries(new FormData(checkoutForm));
    const lines = cartLines();
    if (!lines.length) return;
    const orderNo = 'HL-' + Date.now().toString(36).toUpperCase().slice(-6);
    const body = [
      `Hello Healthy Lifestyle,`, ``, `I would like to place order ${orderNo}:`, ``,
      ...lines.map(({ p, qty }) => `• ${qty} × ${p.name} (${p.size}) — ${money(p.price * qty)}`),
      ``, `Total: ${money(cartTotal())}`, ``,
      `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`, `Delivery address: ${data.address}`,
      data.note ? `Note: ${data.note}` : '', ``, `Thank you!`,
    ].join('\n');
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent('New order ' + orderNo)}&body=${encodeURIComponent(body)}`;
    $('#orderNo').textContent = orderNo;
    $('#resendMail').href = href;
    cart = {}; storage.set('hl-cart', cart); renderCart();
    checkoutForm.reset();
    setView('done');
    location.href = href;
  });
  $$('input, textarea', checkoutForm).forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));

  /* ---------- toasts ---------- */
  const toasts = $('#toasts');
  function toast({ img, html, action, onAction }) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `${img ? `<img src="${img}" alt="">` : `<span class="t-ico">${icon('i-check')}</span>`}<span>${html}</span>${action ? `<button type="button">${action}</button>` : ''}`;
    const dismiss = () => { el.classList.remove('in'); setTimeout(() => el.remove(), 450); };
    if (action) $('button', el).addEventListener('click', () => { dismiss(); onAction(); });
    toasts.appendChild(el);
    while (toasts.children.length > 3) toasts.firstElementChild.remove();
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
    setTimeout(dismiss, 3200);
  }

  /* ---------- contact ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.classList.add('copied');
      $('use', b).setAttribute('href', '#i-check');
      toast({ html: 'Copied to clipboard' });
      setTimeout(() => { b.classList.remove('copied'); $('use', b).setAttribute('href', '#i-copy'); }, 1800);
    } catch {
      toast({ html: 'Could not copy. Please select the text manually.' });
    }
  }));

  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const body = `${f.get('message')}\n\n— ${f.get('name')} (${f.get('email')})`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Message from ' + f.get('name'))}&body=${encodeURIComponent(body)}`;
    toast({ html: '<b>Almost there!</b> Your email app is opening with your message.' });
    e.target.reset();
  });

  /* ---------- misc ---------- */
  $('#toTop').addEventListener('click', () => scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------- init ---------- */
  renderGrid();
  renderCart();
  moveIndicator();
  onScroll();
})();
