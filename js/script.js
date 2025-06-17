// js/cart.js

// Ambil tombol tambah keranjang
const buttons = document.querySelectorAll('.btn-add-cart');

// Ambil data keranjang dari localStorage atau inisialisasi baru
let cart = JSON.parse(localStorage.getItem('cart')) || {};

// Fungsi simpan keranjang ke localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Fungsi tambah item ke keranjang
function addToCart(id) {
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
  saveCart();
  alert('Berhasil ditambahkan ke keranjang!');
}

// Pasang event click ke semua tombol tambah keranjang
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    addToCart(id);
  });
});
// Fungsi Pencarian
function setupSearch() {
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');

  function performSearch() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm === '') {
      displayProducts(products);
      document.querySelector('main h2').textContent = 'Koleksi Buku Terbaru';
      return;
    }
    
    const filteredProducts = products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(filteredProducts, searchTerm);
  }

  function displaySearchResults(results, searchTerm) {
    const mainContent = document.querySelector('main');
    
    if (results.length === 0) {
      mainContent.innerHTML = `
        <div class="no-results">
          <h2>Tidak ditemukan hasil untuk "${searchTerm}"</h2>
          <p>Coba dengan kata kunci lain</p>
        </div>
      `;
      return;
    }
    
    let html = '<h2>Hasil Pencarian untuk "' + searchTerm + '"</h2><div class="book-list" id="book-list"></div>';
    mainContent.innerHTML = html;
    displayProducts(results);
  }

  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });
}

// Panggil fungsi setupSearch setelah DOM loaded
document.addEventListener('DOMContentLoaded', function() {
  // ... kode yang sudah ada ...
  setupSearch();
});