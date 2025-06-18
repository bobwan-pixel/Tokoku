
# 🛒 Tokoku

Tokoku adalah proyek toko buku online berbasis web menggunakan **Firebase** (Authentication & Firestore), dibuat untuk keperluan pembelajaran dan pengembangan e-commerce sederhana.

## 🎯 Fitur Utama

- 🔐 Login & Register dengan Firebase Authentication
- 📦 Kelola Produk oleh Admin
- 🛍️ Keranjang belanja (real-time Firestore)
- ✅ Checkout dan Riwayat Pesanan
- 🔔 Notifikasi dan Status Pesanan
- 📱 Tampilan responsif & modern

## 📁 Struktur Folder

```
📦 Tokoku
├── 📂 admin                # Panel admin
│   ├── dashboard.html
│   ├── orders.html
│   ├── products.html
│   └── users.html
├── 📂 auth                 # Login & Register
│   ├── login.html
│   ├── register.html
├── 📂 css                  # File CSS
│   ├── style.css
│   ├── cart.css
│   └── product.css
├── 📂 js                   # JavaScript Modules
│   ├── auth-firebase.js
│   ├── cart.js
│   ├── checkout.js
│   ├── template.js
│   └── products.js
├── 📂 img / assets         # Gambar produk
├── index.html             # Halaman utama
├── cart.html              # Halaman keranjang
├── checkout.html          # Halaman checkout
├── orders.html            # Halaman pesanan user
├── notification.html      # Riwayat notifikasi user
├── product.html           # Detail produk
├── header.html            # Komponen header dinamis
└── README.md
```

## 🚀 Cara Menjalankan (Lokal)

1. Download dan ekstrak file `.zip` ini
2. Buka file `index.html` di browser (pastikan file lokal bisa akses `module`)
3. Pastikan kamu punya koneksi internet untuk load Firebase SDK
4. Pastikan Firebase Authentication dan Firestore sudah dikonfigurasi
5. Jalankan langsung di GitHub Pages jika ingin publish

## ⚙️ Firebase yang Digunakan

- **Firebase Authentication**: Email/Password Login
- **Firestore Database**: Menyimpan data `products`, `carts`, `orders`, dan `notifications`
- **Rules Firestore**:
```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /carts/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /orders/{orderId} {
      allow read, write: if request.auth != null;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth.token.email == "terepandu@gmail.com";
    }
  }
}
```

## 🧑‍💻 Admin Login

Gunakan email berikut agar bisa mengakses halaman admin:

```
Email Admin: terepandu@gmail.com
```

## 📌 Catatan

- Seluruh data produk disimpan di koleksi `products`
- Halaman `product.html` mengambil data berdasarkan `?id=xxx`
- Gunakan Firebase Console untuk melihat data user, produk, dan pesanan

## 💡 Kredit

Proyek ini dibuat oleh [@bobwan-pixel](https://github.com/bobwan-pixel) untuk pembelajaran frontend dan backend menggunakan Firebase.
