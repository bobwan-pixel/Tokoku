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

  // Validasi wajib isi
  if (!email || !password || !confirmPassword) {
    alert("Semua kolom wajib diisi.");
    return;
  }

  // ✅ Validasi format email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Format email tidak valid.");
    return;
  }

  // Validasi panjang kata sandi
  if (password.length < 6) {
    alert("Kata sandi minimal 6 karakter.");
    return;
  }

  // Validasi konfirmasi kata sandi
  if (password !== confirmPassword) {
    alert("Kata sandi tidak cocok.");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // ✅ Kirim email verifikasi
    await sendEmailVerification(userCredential.user);
    alert("Pendaftaran berhasil! Cek email Anda untuk verifikasi.");

    // Arahkan ke login
    window.location.href = "login.html";
  } catch (error) {
    alert("Gagal daftar: " + error.message);
  }
});