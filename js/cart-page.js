// js/cart-page.js
import { db, auth } from './auth-firebase.js';
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function loadCart() {
  const cartContainer = document.getElementById("cart-content");
  if (!cartContainer) return; // Hindari error innerHTML null

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      cartContainer.innerHTML = "<p>Silakan login untuk melihat keranjang Anda.</p>";
      return;
    }

    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);

      if (!cartSnap.exists()) {
        cartContainer.innerHTML = "<p>Keranjang Anda kosong.</p>";
        return;
      }

      const cartData = cartSnap.data();
      const items = cartData.items || {};

      if (Object.keys(items).length === 0) {
        cartContainer.innerHTML = "<p>Keranjang Anda kosong.</p>";
        return;
      }

      // Ambil semua produk dari koleksi "products"
      const productMap = {};
      const snapshot = await getDocs(collection(db, "products"));
      snapshot.forEach(doc => {
        productMap[doc.id] = doc.data();
      });

      // Buat tampilan keranjang
      let total = 0;
      let html = `
        <table class="cart-table">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Jumlah</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
      `;

      for (const [productId, quantity] of Object.entries(items)) {
        const product = productMap[productId];
        if (!product) continue;

        const subtotal = product.price * quantity;
        total += subtotal;

        html += `
          <tr>
            <td>${product.title}</td>
            <td>${quantity}</td>
            <td>Rp ${subtotal.toLocaleString('id-ID')}</td>
          </tr>
        `;
      }

      html += `
          </tbody>
        </table>
        <div class="cart-summary">
          <div class="total-price">Total: <span>Rp ${total.toLocaleString('id-ID')}</span></div>
          <button class="checkout-btn" onclick="window.location.href='checkout.html'">Bayar Sekarang</button>
        </div>
      `;

      cartContainer.innerHTML = html;

    } catch (err) {
      console.error("🔥 Gagal memuat keranjang:", err.code, err.message);
      cartContainer.innerHTML = `<p style="color:red;">Gagal memuat keranjang: ${err.message}</p>`;
    }
  });
}

document.addEventListener("DOMContentLoaded", loadCart);