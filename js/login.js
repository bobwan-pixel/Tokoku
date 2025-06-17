import { auth } from "./auth-firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showToast("Email dan kata sandi wajib diisi.");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    showToast("Login berhasil!");
    setTimeout(() => {
      window.location.href = "../profile.html";
    }, 1000);
  } catch (error) {
    showToast("Login gagal: " + error.message);
  }
});