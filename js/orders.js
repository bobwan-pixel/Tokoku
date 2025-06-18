// js/orders.js
import { auth, db } from "./auth-firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const ordersListContainer = document.getElementById("orders-list-container");
const filterButtons = document.querySelectorAll(".filter-btn");
let currentUser = null; // Variabel untuk menyimpan pengguna yang sedang login

// Fungsi untuk menampilkan skeleton loader
function showSkeletonLoader() {
  const skeletonHtml = `
    <div class="order-card skeleton-card">
      <div class="order-header">
        <div class="order-info-group">
          <div class="skeleton-text short" style="height: 24px;"></div>
          <div class="skeleton-text medium" style="height: 18px; margin-top: 5px;"></div>
        </div>
        <div class="skeleton-text short" style="height: 28px;"></div>
      </div>
      <div class="status-timeline" style="margin-bottom: 2rem;">
        <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
        <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
        <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
        <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
      </div>
      <div class="order-body">
        ${Array(2).fill(0).map(() => `
          <div class="product-item" style="gap: 1.2rem;"> <div class="product-info" style="flex:1;">
              <div class="skeleton-text long"></div>
              <div class="skeleton-text medium"></div>
            </div>
            <div class="skeleton-text short"></div>
          </div>
        `).join('')}
        <div class="order-actions">
          <div class="skeleton-text" style="width: 100%; height: 45px;"></div>
        </div>
      </div>
    </div>
    ${Array(1).fill(0).map(() => `
      <div class="order-card skeleton-card">
        <div class="order-header">
          <div class="order-info-group">
            <div class="skeleton-text short" style="height: 24px;"></div>
            <div class="skeleton-text medium" style="height: 18px; margin-top: 5px;"></div>
          </div>
          <div class="skeleton-text short" style="height: 28px;"></div>
        </div>
        <div class="status-timeline" style="margin-bottom: 2rem;">
          <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
          <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
          <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
          <div class="step"><div class="dot skeleton"></div><span class="skeleton-text short"></span></div>
        </div>
        <div class="order-body">
          ${Array(1).fill(0).map(() => `
            <div class="product-item" style="gap: 1.2rem;"> <div class="product-info" style="flex:1;">
                <div class="skeleton-text long"></div>
                <div class="skeleton-text medium"></div>
              </div>
              <div class="skeleton-text short"></div>
            </div>
          `).join('')}
          <div class="order-actions">
            <div class="skeleton-text" style="width: 100%; height: 45px;"></div>
          </div>
        </div>
      </div>
    `).join('')}
  `;
  ordersListContainer.innerHTML = skeletonHtml;
}

// Fungsi untuk merender timeline status
function renderStatusTimeline(currentStatus) {
  // Urutan status yang sesuai dengan kebutuhan Anda
  const statuses = ['diproses', 'dikirim', 'selesai', 'dibatalkan'];
  let timelineHtml = '<div class="status-timeline">';

  statuses.forEach(status => {
    let stepClass = '';
    // Logika untuk status "dibatalkan" akan sedikit berbeda
    if (currentStatus === 'dibatalkan') {
        if (status === 'dibatalkan') {
            stepClass = 'active'; // Hanya 'dibatalkan' yang aktif
        }
    } else {
        // Untuk status normal (diproses, dikirim, selesai)
        if (currentStatus === status) {
            stepClass = 'active';
        } else if (statuses.indexOf(currentStatus) > statuses.indexOf(status)) {
            // Pastikan status "dibatalkan" tidak membuat status lain menjadi "completed"
            if (status !== 'dibatalkan') {
                 stepClass = 'completed';
            }
        }
    }

    let statusText = status.charAt(0).toUpperCase() + status.slice(1);
    if (status === 'dibatalkan') statusText = 'Dibatalkan'; // Pastikan kapitalisasi benar
    if (status === 'diproses') statusText = 'Diproses'; // Pastikan kapitalisasi benar

    timelineHtml += `
      <div class="step ${stepClass}">
        <div class="dot"></div>
        <span>${statusText}</span>
      </div>
    `;
  });
  timelineHtml += '</div>';
  return timelineHtml;
}


async function renderOrders(user, filterStatus = "all") {
  if (!user) {
    ordersListContainer.innerHTML = `
      <div class="empty-state">
          <i class="fas fa-user-circle"></i>
          <h3>Silakan login untuk melihat riwayat pesanan Anda.</h3>
          <a href="login.html" class="shop-now-btn">Login Sekarang</a>
      </div>
    `;
    return;
  }

  showSkeletonLoader(); // Tampilkan loader sebelum memuat data

  try {
    let q;
    if (filterStatus === "all") {
      q = query(collection(db, "orders"), where("userId", "==", user.uid));
    } else {
      q = query(collection(db, "orders"), where("userId", "==", user.uid), where("status", "==", filterStatus));
    }
    
    const snapshot = await getDocs(q);
    ordersListContainer.innerHTML = ""; // Kosongkan container setelah data dimuat

    if (snapshot.empty) {
      let emptyMessage = `Tidak ada pesanan dengan status "${filterStatus === 'all' ? 'ini' : filterStatus}".`;
      if (filterStatus === 'all') {
          emptyMessage = `Belum ada pesanan yang tercatat.`;
      }

      ordersListContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-box-open"></i>
            <h3>${emptyMessage}</h3>
            <p>Mulai belanja untuk melihat riwayat pesanan Anda di sini!</p>
            <a href="index.html" class="shop-now-btn">Mulai Belanja</a>
        </div>
      `;
      return;
    }

    snapshot.forEach(docSnap => {
      const order = docSnap.data();
      const orderId = docSnap.id;
      const status = order.status || "diproses"; // Default ke 'diproses' jika kosong
      const estimasiTanggal = order.estimasiTanggalSampai
        ? order.estimasiTanggalSampai.toDate().toLocaleDateString("id-ID")
        : "Belum ada estimasi";
      const createdAtDate = order.createdAt?.seconds
        ? new Date(order.createdAt.seconds * 1000).toLocaleDateString("id-ID", {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        : "-";

      const timelineHtml = renderStatusTimeline(status);

      const card = document.createElement("div");
      card.className = "order-card";
      card.innerHTML = `
        <div class="order-header">
            <div class="order-info-group">
                <span class="order-id">ID Pesanan: #${orderId.substring(0, 8).toUpperCase()}</span>
                <span class="order-date">Tanggal Pesan: ${createdAtDate}</span>
            </div>
            <span class="order-total">Total: Rp ${order.total?.toLocaleString("id-ID") || 0}</span>
        </div>
        ${timelineHtml}
        <div class="order-body">
            ${order.items.map(item => `
              <div class="product-item">
                <div class="product-info">
                  <div class="product-name">${item.title || 'Produk Tidak Dikenal'}</div>
                  <div class="product-quantity-price">${item.quantity} x Rp ${item.price?.toLocaleString("id-ID") || 0}</div>
                </div>
                <div class="product-item-total">Rp ${(item.quantity * item.price).toLocaleString("id-ID")}</div>
              </div>
            `).join('')}
            ${order.estimasiHari ? `<p class="order-estimasi"><strong>Estimasi Tiba:</strong> ${order.estimasiHari} hari (${estimasiTanggal})</p>` : `<p class="order-estimasi"><strong>Estimasi Tiba:</strong> Informasi estimasi belum tersedia.</p>`}

            <div class="order-actions">
              <button class="action-btn detail-btn" onclick="window.location.href='order-detail.html?id=${orderId}'">
                  <i class="fas fa-info-circle"></i> Detail Pesanan
              </button>
              ${status === 'dikirim' ? `
                <button class="action-btn track-btn" onclick="konfirmasiPesanan('${orderId}')">
                    <i class="fas fa-check-circle"></i> Saya Terima Pesanan
                </button>` : ""
              }
              ${(status === 'diproses' || status === 'dikirim') ? `
                <button class="action-btn cancel-btn" onclick="batalkanPesanan('${orderId}')">
                    <i class="fas fa-times-circle"></i> Batalkan Pesanan
                </button>` : ""
              }
            </div>
        </div>
      `;
      ordersListContainer.appendChild(card);
    });
  } catch (err) {
    console.error("❌ Gagal memuat pesanan:", err);
    ordersListContainer.innerHTML = `
      <div class="empty-state">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Terjadi kesalahan saat memuat pesanan.</h3>
          <p>Mohon coba lagi nanti atau hubungi dukungan.</p>
          <a href="index.html" class="shop-now-btn">Kembali ke Beranda</a>
      </div>
    `;
  }
}

// Event listener untuk tombol filter
filterButtons.forEach(button => {
  button.addEventListener("click", (e) => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    const status = e.target.dataset.status;
    if (currentUser) {
      renderOrders(currentUser, status);
    }
  });
});


auth.onAuthStateChanged(async (user) => {
  currentUser = user;
  if (currentUser) {
    renderOrders(currentUser, "all"); // Muat semua pesanan secara default
  } else {
    ordersListContainer.innerHTML = `
      <div class="empty-state">
          <i class="fas fa-user-circle"></i>
          <h3>Silakan login untuk melihat riwayat pesanan Anda.</h3>
          <a href="login.html" class="shop-now-btn">Login Sekarang</a>
      </div>
    `;
  }
});


// Fungsi global untuk konfirmasi pesanan
window.konfirmasiPesanan = async function(orderId) {
  if (!confirm("Apakah Anda yakin sudah menerima pesanan ini? Aksi ini tidak dapat dibatalkan.")) return;
  const orderRef = doc(db, "orders", orderId);
  try {
    await updateDoc(orderRef, {
      status: "selesai",
      selesaiAt: Timestamp.now()
    });
    alert("Terima kasih! Pesanan ditandai selesai.");
    if (currentUser) {
        // Cek filter aktif, jika "selesai" tetap di filter, jika tidak, kembali ke "all"
        const currentFilter = document.querySelector('.filter-btn.active').dataset.status;
        renderOrders(currentUser, currentFilter);
    }
  } catch (error) {
    console.error("Gagal mengkonfirmasi pesanan:", error);
    alert("Gagal mengkonfirmasi pesanan. Silakan coba lagi.");
  }
};

// Fungsi global untuk membatalkan pesanan
window.batalkanPesanan = async function(orderId) {
  if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat dibatalkan.")) return;
  const orderRef = doc(db, "orders", orderId);
  try {
    await updateDoc(orderRef, {
      status: "dibatalkan",
      dibatalkanAt: Timestamp.now() // Tambahkan timestamp pembatalan
    });
    alert("Pesanan berhasil dibatalkan.");
    if (currentUser) {
        // Cek filter aktif, jika "dibatalkan" tetap di filter, jika tidak, kembali ke "all"
        const currentFilter = document.querySelector('.filter-btn.active').dataset.status;
        renderOrders(currentUser, currentFilter);
    }
  } catch (error) {
    console.error("Gagal membatalkan pesanan:", error);
    alert("Gagal membatalkan pesanan. Silakan coba lagi.");
  }
};