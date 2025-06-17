import { auth } from "./auth-firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const loginBtn = document.getElementById("login-btn");

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login berhasil!");
    window.location.href = "../profile.html";
  } catch (error) {
    alert("Login gagal: " + error.message);
  }
});