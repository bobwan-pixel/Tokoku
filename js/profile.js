import { auth } from "./auth-firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Element DOM
const emailElem = document.getElementById("user-email");
const logoutBtn = document.getElementById("logout-btn");
const dashboardBtn = document.getElementById("dashboard-btn");
const guestButtons = document.getElementById("guest-buttons");
const completionPercent = document.getElementById("completion-percent");
const progressFill = document.getElementById("progress-fill");
const avatarInput = document.getElementById("avatar-input");
const profileAvatar = document.getElementById("profile-avatar");

// Email admin
const adminEmail = "terepandu@gmail.com";

// Fungsi untuk menampilkan notifikasi
function showToast(message, type = "info") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `toast-notification ${type}`;
  toast.classList.add("show");
  
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// Pantau status login pengguna
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Tampilkan informasi pengguna
    emailElem.innerHTML = `<i class="fas fa-envelope"></i> ${user.email}`;
    
    // Update progress profil (contoh: 75% lengkap)
    const completion = 75; // Ini bisa diambil dari database
    completionPercent.textContent = `${completion}%`;
    progressFill.style.width = `${completion}%`;
    
    // Tampilkan tombol aksi
    logoutBtn.style.display = "inline-flex";
    
    // Cek apakah admin
    if (user.email === adminEmail) {
      dashboardBtn.style.display = "inline-flex";
    }
    
    // Sembunyikan tombol guest
    guestButtons.style.display = "none";
    
    // Tampilkan pesan sukses
    showToast(`Berhasil masuk sebagai ${user.email}`, "success");
  } else {
    // Reset tampilan jika tidak ada user
    emailElem.textContent = "";
    logoutBtn.style.display = "none";
    dashboardBtn.style.display = "none";
    guestButtons.style.display = "block";
    completionPercent.textContent = "0%";
    progressFill.style.width = "0%";
  }
});

// Handler tombol logout
logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    showToast("Anda berhasil keluar", "success");
    setTimeout(() => {
      window.location.href = "auth/login.html";
    }, 1500);
  } catch (error) {
    showToast(`Gagal keluar: ${error.message}`, "error");
  }
});

// Handler upload foto profil
avatarInput?.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      profileAvatar.src = event.target.result;
      showToast("Foto profil berhasil diubah", "success");
      // Di sini bisa tambahkan kode untuk upload ke storage
    };
    reader.readAsDataURL(file);
  }
});

// Handler tombol dashboard admin
dashboardBtn?.addEventListener("click", () => {
  window.location.href = "admin/dashboard.html";
});

// Fungsi global untuk dipanggil dari HTML
window.showToast = showToast;