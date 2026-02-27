// loader.js
window.addEventListener("load", function() {
  const loader = document.getElementById("loader");
  const content = document.getElementById("content");

  loader.style.opacity = 0; 
  setTimeout(() => {
    loader.style.display = "none";
    content.style.display = "block"; 
  }, 500); 
});

/* ══════════════════════════════
   CART DATA
══════════════════════════════ */
let cartItems = [
  { id: 1, name: 'Fresh Orange Juice',  meta: '500ml · x1', price: 4.99, qty: 2, img: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=150&q=80' },
  { id: 2, name: 'Organic Apples',      meta: '1kg bag · x1', price: 3.49, qty: 1, img: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=150&q=80' },
  { id: 3, name: 'Sourdough Bread',     meta: '400g loaf · x1', price: 2.99, qty: 1, img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&q=80' },
];

/* ── Render Cart ── */
function renderCart() {
  const body = document.getElementById('cartBody');

  if (!cartItems.length) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 001.99 1.61h9.72a2 2 0 001.99-1.78l1.38-7.22H6"/>
        </svg>
        <p>Your cart is empty</p>
      </div>`;
  } else {
    body.innerHTML = cartItems.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" class="cart-item-img" alt="${item.name}"/>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">${item.meta}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
        <button class="cart-item-del" onclick="removeItem(${item.id})" title="Remove">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </div>
    `).join('');
  }

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  document.getElementById('cartTotal').textContent        = '$' + total.toFixed(2);
  document.getElementById('cartPriceDesktop').textContent = '$' + total.toFixed(2);
  document.getElementById('cartCount').textContent        = `(${count} item${count !== 1 ? 's' : ''})`;
  document.getElementById('cartBadge').textContent        = count;
}

function changeQty(id, delta) {
  const item = cartItems.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
}

function removeItem(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  renderCart();
}

/* ── Open / Close Cart ── */
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cartToggleDesktop').addEventListener('click', openCart);
document.getElementById('cartToggleMobile').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
document.getElementById('cartOverlay').addEventListener('click', closeCart);
document.getElementById('cartContinue').addEventListener('click', closeCart);

/* ── Mobile Cart Icon ── */
function checkMobile() {
  const isMobile = window.innerWidth <= 767;
  document.getElementById('cartToggleMobile').style.display = isMobile ? 'flex' : 'none';
}
checkMobile();
window.addEventListener('resize', checkMobile);

renderCart();


/* ══════════════════════════════
   TRENDING — FILTER TABS
══════════════════════════════ */
(function () {
  const btns  = document.querySelectorAll('.tf-btn');
  const cards = document.querySelectorAll('.product-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.classList.remove('fade-in');

        if (show) {
          card.classList.remove('hidden');
          setTimeout(() => card.classList.add('fade-in'), i * 60);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();


/* ══════════════════════════════
   TRENDING — QTY CONTROLS
══════════════════════════════ */
function changeProductQty(btn, delta) {
  const wrap = btn.closest('.qty-control');
  const num  = wrap.querySelector('.qty-num');
  let val    = parseInt(num.textContent) + delta;
  if (val < 1) val = 1;
  num.textContent = val;
}


/* ══════════════════════════════
   TRENDING — WISHLIST TOGGLE
══════════════════════════════ */
document.querySelectorAll('.product-wish').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.classList.toggle('wished');
  });
});


/* ══════════════════════════════
   TRENDING — ADD TO CART
══════════════════════════════ */
function addToCart(btn) {
  const card  = btn.closest('.product-card');
  const name  = card.querySelector('.product-name').textContent;
  const price = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
  const qty   = parseInt(card.querySelector('.qty-num').textContent);
  const img   = card.querySelector('.product-img').src;

  btn.textContent = '✓ Added';
  btn.classList.add('added');
  setTimeout(() => {
    btn.textContent = 'Add to Cart';
    btn.classList.remove('added');
  }, 1500);

  const existing = cartItems.find(i => i.name === name);
  if (existing) {
    existing.qty += qty;
  } else {
    cartItems.push({
      id:    Date.now(),
      name:  name,
      meta:  `${qty} unit`,
      price: price,
      qty:   qty,
      img:   img
    });
  }
  renderCart();
}


/* ══════════════════════════════
   FOOTER — SUBSCRIBE FORM
══════════════════════════════ */
function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('.footer-email-input');
  const msg   = document.getElementById('subscribeMsg');
  msg.textContent = '✓ You\'ve subscribed successfully!';
  input.value = '';
  setTimeout(() => msg.textContent = '', 4000);
}