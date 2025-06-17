import { auth } from "./auth-firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const registerBtn = document.getElementById("register-btn");

registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  if (!email || !password || !confirmPassword) {
    showToast("Semua kolom wajib diisi.");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Format email tidak valid.");
    return;
  }

  if (password.length < 6) {
    showToast("Kata sandi minimal 6 karakter.");
    return;
  }

  if (password !== confirmPassword) {
    showToast("Kata sandi tidak cocok.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    showToast("Pendaftaran berhasil! Cek email Anda untuk verifikasi.");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      showToast("Email sudah terdaftar. Silakan login.");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      showToast("Gagal daftar: " + error.message);
    }
  }
});