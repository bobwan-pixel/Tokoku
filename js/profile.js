import { auth } from "./auth-firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const emailElem = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const dashboardBtn = document.getElementById("dashboard-btn");
const guestButtons = document.getElementById("guest-buttons");

const adminEmail = "terepandu@gmail.com";

// Pantau status login
onAuthStateChanged(auth, (user) => {
  if (user) {
    // ✅ Tampilkan email
    emailElem.textContent = "📧 " + user.email;

    // ✅ Tampilkan tombol logout
    logoutBtn.style.display = "inline-block";

    // ✅ Jika admin, tampilkan tombol dashboard
    if (user.email === adminEmail) {
      dashboardBtn.style.display = "inline-block";
    }

    // ✅ Sembunyikan tombol guest
    guestButtons.style.display = "none";
  } else {
    // ❌ Tidak login
    emailElem.textContent = "";
    logoutBtn.style.display = "none";
    dashboardBtn.style.display = "none";
    guestButtons.style.display = "block";

    // 🛑 Opsional: redirect langsung ke login
    // window.location.href = "auth/login.html";
  }
});

// Tombol Logout
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    alert("Berhasil logout.");
    window.location.href = "auth/login.html";
  } catch (err) {
    alert("Logout gagal: " + err.message);
  }
});

// Tombol Admin Dashboard
dashboardBtn?.addEventListener("click", () => {
  window.location.href = "admin/dashboard.html";
});