// js/cart.js
import { db, auth } from './auth-firebase.js';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cartContent = document.getElementById('cart-content');
const summaryContainer = document.getElementById('cart-summary-container');
const cartMain = document.getElementById('cart-main');

function showSkeletonLoader() {
    const itemsLoader = `
      <div class="cart-items-list">
          ${Array(3).fill(0).map(() => `
              <div class="cart-item">
                  <div class="item-image skeleton"></div>
                  <div class="item-details" style="flex-grow:1;">
                      <h4 class="skeleton" style="height:24px; width:70%; border-radius:4px;"></h4>
                      <p class="skeleton" style="height:18px; width:40%; border-radius:4px;"></p>
                  </div>
              </div>
          `).join('')}
      </div>
    `;
    const summaryLoader = `
      <div class="cart-summary">
           <h3 class="summary-title skeleton" style="height:36px; width:80%; border-radius:4px;"></h3>
           <div class="summary-line skeleton" style="height:24px; width:100%; border-radius:4px; margin-bottom: 1rem;"></div>
           <div class="summary-line skeleton" style="height:24px; width:100%; border-radius:4px;"></div>
           <button class="checkout-btn" disabled>Memuat...</button>
      </div>
    `;
    cartContent.innerHTML = itemsLoader;
    summaryContainer.innerHTML = summaryLoader;
}

async function renderCart(user) {
  const cartRef = doc(db, "carts", user.uid);
  const [cartSnap, productSnap] = await Promise.all([
      getDoc(cartRef),
      getDocs(collection(db, "products"))
  ]);

  const productMap = {};
  productSnap.forEach(p => {
    productMap[p.id] = { id: p.id, ...p.data() };
  });

  const items = cartSnap.exists() ? cartSnap.data().items || [] : [];

  if (!Array.isArray(items) || items.length === 0) {
    cartMain.innerHTML = `
      <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang belanja Anda masih kosong.</p>
          <a href="index.html" class="shop-now-btn">Mulai Belanja</a>
      </div>`;
    return;
  }

  let subtotal = 0;
  let totalItems = 0;
  let itemsHtml = '<div class="cart-items-list">';

  items.forEach(item => {
    const product = productMap[item.productId];
    if (!product) return;

    const itemTotal = item.quantity * product.price;
    subtotal += itemTotal;
    totalItems += item.quantity;

    itemsHtml += `
      <div class="cart-item">
        <img src="${product.image || 'img/placeholder.png'}" alt="${product.title}" class="item-image">
        <div class="item-details">
          <h4>${product.title}</h4>
          <p>Rp ${product.price.toLocaleString("id-ID")}</p>
        </div>
        <div class="item-controls">
          <div class="quantity-control">
            <button class="quantity-btn decrease" data-id="${item.productId}" title="Kurangi">
              <i class="fas fa-minus"></i>
            </button>
            <span>${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${item.productId}" title="Tambah">
              <i class="fas fa-plus"></i>
            </button>
          </div>
           <button class="remove-btn" data-id="${item.productId}" title="Hapus Item">
              <i class="fas fa-trash-alt"></i>
          </button>
        </div>
        <div class="item-subtotal">
           <strong>Rp ${itemTotal.toLocaleString("id-ID")}</strong>
        </div>
      </div>
    `;
  });
  itemsHtml += '</div>';

  const shipping = 5000;
  const total = subtotal + shipping;

  const summaryHtml = `
    <div class="cart-summary">
      <h3 class="summary-title">Ringkasan Belanja</h3>
      <div class="summary-line">
          <span>Subtotal (${totalItems} produk)</span>
          <span>Rp ${subtotal.toLocaleString("id-ID")}</span>
      </div>
      <div class="summary-line">
          <span>Ongkos Kirim</span>
          <span>Rp ${shipping.toLocaleString("id-ID")}</span>
      </div>
      <div class="summary-total">
          <span>Total</span>
          <span>Rp ${total.toLocaleString("id-ID")}</span>
      </div>
      <button class="checkout-btn" onclick="window.location.href='checkout.html'">
          Lanjut ke Pembayaran
      </button>
    </div>
  `;

  cartContent.innerHTML = itemsHtml;
  summaryContainer.innerHTML = summaryHtml;
}

async function updateCartItem(productId, action) {
  const user = auth.currentUser;
  if (!user) return;

  const cartRef = doc(db, "carts", user.uid);
  const snap = await getDoc(cartRef);
  let items = snap.exists() ? snap.data().items || [] : [];
  const index = items.findIndex(i => i.productId === productId);
  if (index === -1) return;

  if (action === "increase") {
    items[index].quantity++;
  } else if (action === "decrease") {
    if (items[index].quantity > 1) {
      items[index].quantity--;
    } else {
      items.splice(index, 1);
    }
  } else if (action === "remove") {
    items.splice(index, 1);
  }

  await setDoc(cartRef, { items }, { merge: true });
  renderCart(user);
}

auth.onAuthStateChanged(user => {
  if (!user) {
    cartMain.innerHTML = "<p style='color:white; text-align:center;'>Silakan login untuk melihat keranjang Anda.</p>";
    return;
  }

  showSkeletonLoader();
  renderCart(user);

  cartMain.addEventListener("click", e => {
    const btn = e.target.closest("button[data-id]");
    if (!btn) return;

    const productId = btn.dataset.id;
    if (btn.classList.contains("increase")) {
      updateCartItem(productId, "increase");
    } else if (btn.classList.contains("decrease")) {
      updateCartItem(productId, "decrease");
    } else if (btn.classList.contains("remove-btn")) {
      updateCartItem(productId, "remove");
    }
  });
});