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
    alert("Semua kolom wajib diisi.");
    return;
  }

  if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    alert("Format email tidak valid.");
    return;
  }

  if (password.length < 6) {
    alert("Kata sandi minimal 6 karakter.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Kata sandi tidak cocok.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    alert("Pendaftaran berhasil! Silakan verifikasi email Anda.");
    window.location.href = "login.html";
  } catch (error) {
    alert("Gagal daftar: " + error.message);
  }
});