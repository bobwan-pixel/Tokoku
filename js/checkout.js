document.addEventListener('DOMContentLoaded', () => {
  // Load header
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      if (typeof updateCartBadge === 'function') updateCartBadge();
    });

  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  if (Object.keys(cart).length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  const script = document.createElement('script');
  script.src = 'js/products.js';
  script.onload = () => {
    renderOrderItems(cart, products);
    setupPaymentMethods();
    setupFormValidation(cart, products);
  };
  document.body.appendChild(script);
});

function renderOrderItems(cart, products) {
  const container = document.getElementById('order-items');
  let subtotal = 0;
  container.innerHTML = '';

  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id == productId);
    if (!product) return;

    const qty = cart[productId];
    const total = product.price * qty;
    subtotal += total;

    const itemEl = document.createElement('div');
    itemEl.className = 'order-item';
    itemEl.innerHTML = `<span>${product.title} (x${qty})</span><span>Rp ${total.toLocaleString('id-ID')}</span>`;
    container.appendChild(itemEl);
  });

  document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
  document.getElementById('total').textContent = `Rp ${(subtotal + 15000).toLocaleString('id-ID')}`;
}

function setupPaymentMethods() {
  const methods = document.querySelectorAll('.payment-method');
  methods.forEach(method => {
    method.addEventListener('click', () => {
      methods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
    });
  });
}

function setupFormValidation(cart, products) {
  document.getElementById('place-order').addEventListener('click', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone')?.value.trim() || '';
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city')?.value.trim() || '';
    const postal = document.getElementById('postal')?.value.trim() || '';
    const selectedPayment = document.querySelector('.payment-method.selected');

    if (!name || !email || !address || !selectedPayment) {
      showToast('Lengkapi semua data dan pilih metode pembayaran!');
      return;
    }

    // Create order data
    const orderItems = Object.keys(cart).map(id => {
      const product = products.find(p => p.id == id);
      return {
        id: product?.id || '',
        name: product?.title || 'Produk',
        price: product?.price || 0,
        qty: cart[id],
        image: product?.image || ''
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = 15000;
    const total = subtotal + shipping;

    const newOrder = {
      id: 'TK-' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      status: 'processing',
      customer: { name, email, phone },
      shipping: { address, city, postal },
      payment: selectedPayment.getAttribute('data-method'),
      items: orderItems,
      subtotal,
      shippingCost: shipping,
      total
    };

    // Save to orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.unshift(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');
    if (typeof updateCartBadge === 'function') updateCartBadge();

    // Show success and redirect
    showToast('Pesanan berhasil dibuat!');
    setTimeout(() => {
      window.location.href = 'orders.html?order_success=' + newOrder.id;
    }, 1500);
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}