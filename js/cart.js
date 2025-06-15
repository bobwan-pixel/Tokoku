// ===== GLOBAL VARIABLES =====
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, isSuccess = true) {
  const notification = document.createElement('div');
  notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
  notification.innerHTML = `
    <i class="fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== CART OPERATIONS =====
function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function addToCart(productId) {
  if (!products.find(p => p.id == productId)) {
    showNotification('Produk tidak ditemukan', false);
    return;
  }

  cart[productId] = (cart[productId] || 0) + 1;
  updateCart();
  showNotification('Produk ditambahkan ke keranjang');
}

function removeFromCart(productId, completely = false) {
  if (!cart[productId]) return;

  if (completely || cart[productId] <= 1) {
    const productName = getProductName(productId);
    delete cart[productId];
    updateCart();
    showNotification(`${productName} dihapus dari keranjang`);
  } else {
    cart[productId]--;
    updateCart();
  }
}

// ===== HELPER FUNCTIONS =====
function getProductName(productId) {
  const product = products.find(p => p.id == productId);
  return product ? product.title : 'Produk';
}

function updateCartBadge() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const badge = document.getElementById('cart-badge');
  
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
  }
}

function renderCartItems() {
  const cartTableBody = document.querySelector('#cart-table tbody');
  
  if (!cartTableBody) return;

  if (Object.keys(cart).length === 0) {
    cartTableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-cart-message">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang belanja kosong</p>
        </td>
      </tr>
    `;
    return;
  }

  cartTableBody.innerHTML = Object.keys(cart).map(productId => {
    const product = products.find(p => p.id == productId);
    if (!product) return '';
    
    const quantity = cart[productId];
    const total = product.price * quantity;

    return `
      <tr>
        <td>${product.title}</td>
        <td>Rp ${product.price.toLocaleString('id-ID')}</td>
        <td>
          <div class="quantity-control">
            <button class="quantity-btn decrease" data-id="${productId}">-</button>
            <span>${quantity}</span>
            <button class="quantity-btn increase" data-id="${productId}">+</button>
            <button class="remove-btn" data-id="${productId}" title="Hapus">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
        <td>Rp ${total.toLocaleString('id-ID')}</td>
      </tr>
    `;
  }).join('');
}

// ===== EVENT HANDLERS =====
function handleCartActions(e) {
  const target = e.target.closest('.quantity-btn') || e.target.closest('.remove-btn');
  if (!target) return;

  const productId = target.getAttribute('data-id');
  if (!productId) return;

  if (target.classList.contains('increase')) {
    addToCart(productId);
    renderCartItems();
  } 
  else if (target.classList.contains('decrease')) {
    removeFromCart(productId);
    renderCartItems();
  }
  else if (target.classList.contains('remove-btn')) {
    if (confirm(`Hapus ${getProductName(productId)} dari keranjang?`)) {
      removeFromCart(productId, true);
      renderCartItems();
    }
  }
}

function handleAddToCartButtons(e) {
  if (e.target.classList.contains('btn-add-cart')) {
    const productId = e.target.getAttribute('data-id');
    addToCart(productId);
  }
}

function handleCheckoutButton(e) {
  if (e.target.id === 'checkout-btn' || e.target.closest('#checkout-btn')) {
    e.preventDefault();
    goToCheckout();
  }
}

// ===== CHECKOUT FUNCTION =====
function goToCheckout() {
  if (Object.keys(cart).length === 0) {
    showNotification('Keranjang belanja kosong!', false);
    return;
  }
  
  // Debugging
  console.log('Redirecting to checkout...');
  console.log('Current cart:', cart);
  
  window.location.href = 'checkout.html';
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart UI
  renderCartItems();
  updateCartBadge();

  // Event listeners
  document.addEventListener('click', handleCartActions);
  document.addEventListener('click', handleAddToCartButtons);
  document.addEventListener('click', handleCheckoutButton);
});