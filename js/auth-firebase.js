<!-- Firebase App (core SDK) --><script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"></script><script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"></script><script>
  // Konfigurasi Firebase dari project kamu
  const firebaseConfig = {
    apiKey: "AIzaSyDrOB-lOThEqwIwUCAeS5NyV38cL-STbWY",
    authDomain: "tokoku-73806.firebaseapp.com",
    projectId: "tokoku-73806",
    storageBucket: "tokoku-73806.firebasestorage.app",
    messagingSenderId: "110914597418",
    appId: "1:110914597418:web:ad975d7fa0ce38afe2c953",
    measurementId: "G-PVMHN2E1VZ"
  };

  // Inisialisasi Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  // Fungsi Login
  async function loginWithEmail(email, password) {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login berhasil!");
      window.location.href = "profile.html";
    } catch (error) {
      alert("Login gagal: " + error.message);
    }
  }

  // Fungsi Register
  async function registerWithEmail(email, password) {
    try {
      await auth.createUserWithEmailAndPassword(email, password);
      alert("Registrasi berhasil!");
      window.location.href = "profile.html";
    } catch (error) {
      alert("Registrasi gagal: " + error.message);
    }
  }

  // Cek apakah user sudah login
  function checkAuth(callback) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        callback(user);
      } else {
        alert("Silakan login terlebih dahulu");
        window.location.href = "login.html";
      }
    });
  }

  // Logout
  function logout() {
    auth.signOut().then(() => {
      alert("Berhasil logout");
      window.location.href = "login.html";
    });
  }
</script>