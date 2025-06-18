// js/checkout.js
import { auth, db } from './auth-firebase.js';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const orderItemsEl = document.getElementById("order-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const placeOrderBtn = document.getElementById("place-order");

let cartItems = [];
let productMap = {};

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    alert("Silakan login terlebih dahulu.");
    window.location.href = "auth/login.html";
    return;
  }

  await loadCartItems(user);
  setupFormHandler(user);
});

async function loadCartItems(user) {
  const cartRef = doc(db, "carts", user.uid);
  const cartSnap = await getDoc(cartRef);
  const productSnap = await getDocs(collection(db, "products"));

  productSnap.forEach(doc => {
    productMap[doc.id] = doc.data();
  });

  if (!cartSnap.exists()) {
    orderItemsEl.innerHTML = "<p>Keranjang kosong.</p>";
    return;
  }

  cartItems = cartSnap.data().items || [];

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    orderItemsEl.innerHTML = "<p>Keranjang kosong.</p>";
    return;
  }

  let subtotal = 0;
  let html = "";

  cartItems.forEach(item => {
    const product = productMap[item.productId];
    if (!product) return;

    const totalPerItem = item.quantity * product.price;
    subtotal += totalPerItem;

    html += `
      <div class="order-item">
        <div>${product.title} x ${item.quantity}</div>
        <div>Rp ${totalPerItem.toLocaleString('id-ID')}</div>
      </div>
    `;
  });

  orderItemsEl.innerHTML = html;
  subtotalEl.textContent = "Rp " + subtotal.toLocaleString("id-ID");
  totalEl.textContent = "Rp " + (subtotal + 15000).toLocaleString("id-ID");
}

function setupFormHandler(user) {
  document.querySelectorAll(".payment-method").forEach(el => {
    el.addEventListener("click", () => {
      document.querySelectorAll(".payment-method").forEach(el => el.classList.remove("selected"));
      el.classList.add("selected");
    });
  });

  placeOrderBtn.addEventListener("click", async () => {
    console.log("Tombol diklik, mulai proses checkout...");
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postal = document.getElementById("postal").value.trim();
    const paymentMethod = document.querySelector(".payment-method.selected")?.dataset.method;

    if (!name || !email || !phone || !address || !city || !postal || !paymentMethod) {
      alert("Mohon lengkapi semua data.");
      return;
    }

    if (cartItems.length === 0) {
      alert("Keranjang kosong.");
      return;
    }

    try {
      const formattedItems = cartItems.map(item => {
        const product = productMap[item.productId];
        return {
          productId: item.productId,
          title: product?.title || "Produk",
          price: product?.price || 0,
          quantity: item.quantity
        };
      });

      const total = formattedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        customer: { name, email, phone },
        shipping: { address, city, postal },
        items: formattedItems,
        total,
        paymentMethod,
        status: "diproses",
        createdAt: Timestamp.now()
      });

      await setDoc(doc(db, "carts", user.uid), { items: [] });
      alert("Pesanan berhasil dibuat!");
      window.location.href = "orders.html";

    } catch (err) {
      console.error("❌ Gagal membuat pesanan:", err);
      alert("Gagal membuat pesanan. Coba lagi nanti.");
    }
  });
}