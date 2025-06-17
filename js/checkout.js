document.addEventListener('DOMContentLoaded', () => {
  // Load header
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }
    })
    .catch(error => {
      console.error('Error loading header:', error);
    });

  // Load cart data
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const products = []; // Load from products.js or API
  
  if (Object.keys(cart).length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderOrderItems(cart, products);
  setupPaymentMethods();
  setupFormValidation();
});

function renderOrderItems(cart, products) {
  const orderItemsContainer = document.getElementById('order-items');
  let subtotal = 0;
  
  orderItemsContainer.innerHTML = '';
  
  Object.keys(cart).forEach(productId => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const quantity = cart[productId];
    const total = product.price * quantity;
    subtotal += total;
    
    const itemElement = document.createElement('div');
    itemElement.className = 'order-item';
    itemElement.innerHTML = `
      <span>${product.title} (${quantity}x)</span>
      <span>Rp ${total.toLocaleString('id-ID')}</span>
    `;
    
    orderItemsContainer.appendChild(itemElement);
  });
  
  document.getElementById('subtotal').textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
  document.getElementById('total').textContent = `Rp ${(subtotal + 15000).toLocaleString('id-ID')}`;
}

function setupPaymentMethods() {
  const paymentMethods = document.querySelectorAll('.payment-method');
  
  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      paymentMethods.forEach(m => m.classList.remove('selected'));
      method.classList.add('selected');
    });
  });
}

function setupFormValidation() {
  const submitBtn = document.getElementById('place-order');
  
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const selectedPayment = document.querySelector('.payment-method.selected');
    
    if (!name || !email || !address || !selectedPayment) {
      alert('Harap lengkapi semua informasi yang diperlukan!');
      return;
    }
    
    processOrder();
  });
}

function processOrder() {
  // Here you would typically send the order to your backend
  alert('Pesanan Anda telah berhasil diterima!');
  localStorage.removeItem('cart');
  window.location.href = 'thankyou.html';
}