import { auth, db } from "./auth-firebase.js";
import {
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Jalankan setelah user login
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    document.getElementById("orders-container").innerHTML = "<p>Silakan login untuk melihat pesanan Anda.</p>";
    return;
  }

  const q = query(collection(db, "orders"), where("userId", "==", user.uid));
  const snapshot = await getDocs(q);
  const container = document.getElementById("orders-container");
  container.innerHTML = "";

  if (snapshot.empty) {
    container.innerHTML = "<p style='color: #ccc;'>Belum ada pesanan.</p>";
    return;
  }

  snapshot.forEach(doc => {
    const order = doc.data();
    const estimasiTanggal = order.estimasiTanggalSampai
      ? order.estimasiTanggalSampai.toDate().toLocaleDateString("id-ID")
      : "-";

    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <h3>Pesanan ${doc.id}</h3>
      <p><strong>Tanggal:</strong> ${new Date(order.createdAt?.seconds * 1000).toLocaleDateString("id-ID")}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      ${order.estimasiHari ? `<p><strong>Estimasi:</strong> ${order.estimasiHari} hari (sampai: ${estimasiTanggal})</p>` : ""}
      <table style="margin-top: 1rem;">
        <thead>
          <tr>
            <th>Produk</th>
            <th>Jumlah</th>
            <th>Harga</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${item.title}</td>
              <td>${item.quantity}</td>
              <td>Rp ${item.price.toLocaleString("id-ID")}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <p style="margin-top: 1rem;"><strong>Total:</strong> Rp ${order.total.toLocaleString("id-ID")}</p>
    `;
    container.appendChild(card);
  });
});