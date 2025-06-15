// js/detail.js

// Ambil id produk dari URL
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get('id'));

// Cari produk
const product = products.find(p => p.id === productId);

if (!product) {
  document.querySelector('main').innerHTML = '<p>Produk tidak ditemukan.</p>';
} else {
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-image').src = product.image;
  document.getElementById('product-image').alt = product.title;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('product-price').textContent = 'Rp ' + product.price.toLocaleString('id-ID');

  // Tambahkan ke keranjang
  document.getElementById('btn-add-cart').addEventListener('click', () => {
    addToCart(product.id);
  });
}
