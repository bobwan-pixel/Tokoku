export function loadHeader() {
  fetch('header.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;

      // Aktifkan toggle menu garis tiga setelah header dimuat
      const toggle = document.getElementById("menu-toggle");
      const menu = document.getElementById("dropdown-menu");

      if (toggle && menu) {
        toggle.addEventListener("click", () => {
          menu.classList.toggle("show");
        });
      }

      // Tidak perlu lagi validasi login profil — arahkan langsung ke profile.html

      // Update jumlah item keranjang
      const cart = JSON.parse(localStorage.getItem('cart')) || {};
      const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
      const badge = document.getElementById('cart-badge');

      if (badge) {
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'block' : 'none';
      }
    });
}