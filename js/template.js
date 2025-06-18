import { auth, db } from './auth-firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function loadHeader() {
  fetch('header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;

      const toggle = document.getElementById("menu-toggle");
      const menu = document.getElementById("dropdown-menu");

      if (toggle && menu) {
        toggle.addEventListener("click", () => {
          menu.classList.toggle("show");
        });
      }

      updateCartBadge(); // 🔁 panggil setelah header dimuat
    });
}

async function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (!badge) return;

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      badge.style.display = "none";
      return;
    }

    try {
      const cartRef = doc(db, "carts", user.uid);
      const cartSnap = await getDoc(cartRef);
      const items = cartSnap.exists() ? cartSnap.data().items || [] : [];

      let total = 0;

      if (Array.isArray(items)) {
        total = items.reduce((sum, item) => sum + item.quantity, 0);
      } else if (typeof items === 'object') {
        total = Object.values(items).reduce((sum, qty) => sum + qty, 0);
      }

      badge.textContent = total;
      badge.style.display = total > 0 ? "inline-block" : "none";
    } catch (err) {
      console.error("❌ Gagal update badge:", err);
    }
  });
}