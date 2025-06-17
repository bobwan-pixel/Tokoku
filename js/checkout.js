import { auth, db } from './auth-firebase.js';
import {
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
  // Load header
  fetch('header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      if (typeof updateCartBadge === 'function') updateCartBadge();
    })
    .catch(error => console.error('Error loading header:', error));

  // Validasi login user
  auth.onAuthStateChanged((user) => {
    if (!user) {
      alert("Anda harus login terlebih dahulu.");
      window.location.href = "auth/login.html";
    }
  });

  // Load cart
  const cart = JSON.parse(localStorage.getItem('cart')) || {};
  const products = JSON.parse(localStorage.getItem('products')) || []; // Ganti jika pakai API

  if (Object.keys(cart).length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  renderOrderItems(cart, products);
  setupPaymentMethods();
  setupFormValidation(cart, products);
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

function setupFormValidation(cart, products) {
  const submitBtn = document.getElementById('place-order');
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const postal = document.getElementById('postal').value.trim();
    const payment = document.querySelector('.payment-method.selected');

    if (!name || !email || !phone || !address || !city || !postal || !payment) {
      alert("Harap lengkapi semua data!");
      return;
    }

    processOrder({ name, email, phone, address, city, postal, paymentMethod: payment.dataset.method }, cart, products);
  });
}

async function processOrder(customerInfo, cart, products) {
  const user = auth.currentUser;
  if (!user) {
    alert("Anda harus login untuk melakukan checkout.");
    window.location.href = "auth/login.html";
    return;
  }

  // Konversi cart ke detail produk
  const items = Object.entries(cart).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
    return {
      productId: id,
      title: product?.title || "Produk",
      quantity: qty,
      price: product?.price || 0
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + 15000;

  const orderData = {
    userId: user.uid,
    customer: customerInfo,
    items,
    total,
    status: "diproses",
    createdAt: Timestamp.now()
  };

  try {
    await addDoc(collection(db, "orders"), orderData);
    alert("Pesanan Anda berhasil dibuat!");
    localStorage.removeItem('cart');
    window.location.href = "orders.html";
  } catch (err) {
    alert("Gagal menyimpan pesanan: " + err.message);
  }
}