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

onAuthStateChanged(auth, (user) => {
  if (user) {
    emailElem.textContent = "📧 " + user.email;
    logoutBtn.style.display = "inline-block";

    if (user.email === adminEmail) {
      dashboardBtn.style.display = "inline-block";
    }
  } else {
    emailElem.textContent = "";
    logoutBtn.style.display = "none";
    dashboardBtn.style.display = "none";
    guestButtons.style.display = "block";
  }
});

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  alert("Berhasil logout.");
  window.location.href = "auth/login.html";
});

dashboardBtn?.addEventListener("click", () => {
  window.location.href = "admin/dashboard.html";
});