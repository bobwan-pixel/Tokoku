// Data Contoh
const sampleOrders = [
  {
    id: "ORD-001",
    date: "15 Juni 2023",
    total: 350000,
    status: "shipped",
    products: [
      { name: "Tas Laptop Premium", price: 250000, qty: 1, image: "asset/img1.jpg" },
      { name: "Mouse Wireless", price: 100000, qty: 1, image: "asset/img2.jpg" }
    ]
  },
  {
    id: "ORD-002", 
    date: "10 Juni 2023",
    total: 150000,
    status: "completed",
    products: [
      { name: "Keyboard Mechanical", price: 150000, qty: 1, image: "asset/img3.jpg" }
    ]
  }
];

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  renderOrders();
  initFilters();
});

// Render Orders
function renderOrders(orders = sampleOrders) {
  const ordersList = document.getElementById('ordersList');
  ordersList.innerHTML = '';

  if (orders.length === 0) {
    ordersList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>Belum ada pesanan</h3>
        <p>Yuk mulai belanja di Tokoku!</p>
        <a href="index.html" class="action-btn" style="margin-top:1rem">
          <i class="fas fa-shopping-bag"></i> Belanja Sekarang
        </a>
      </div>
    `;
    return;
  }

  orders.forEach(order => {
    const orderEl = document.createElement('div');
    orderEl.className = 'order-card';
    orderEl.innerHTML = `
      <div class="order-header">
        <div>
          <span class="order-id">${order.id}</span>
          <span class="order-date">${order.date}</span>
        </div>
        <span class="order-total">Rp ${order.total.toLocaleString('id-ID')}</span>
      </div>
      <div class="order-body">
        <div class="status-timeline">
          <div class="step ${['pending', 'shipped', 'completed'].includes(order.status) ? 'completed' : ''}">
            <div class="dot"></div>
            <span>Dipesan</span>
          </div>
          <div class="step ${['shipped', 'completed'].includes(order.status) ? 'completed' : ''} ${order.status === 'pending' ? 'active' : ''}">
            <div class="dot"></div>
            <span>Diproses</span>
          </div>
          <div class="step ${order.status === 'completed' ? 'completed' : ''} ${order.status === 'shipped' ? 'active' : ''}">
            <div class="dot"></div>
            <span>Dikirim</span>
          </div>
          <div class="step ${order.status === 'completed' ? 'active' : ''}">
            <div class="dot"></div>
            <span>Selesai</span>
          </div>
        </div>
        
        ${order.products.map(product => `
          <div class="product-item">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
              <div class="product-name">${product.name}</div>
              <div class="product-meta">
                ${product.qty} × Rp ${product.price.toLocaleString('id-ID')}
              </div>
            </div>
          </div>
        `).join('')}
        
        <div class="order-actions">
          <button class="action-btn track-btn">
            <i class="fas fa-truck"></i> Lacak
          </button>
          <button class="action-btn detail-btn">
            <i class="fas fa-info-circle"></i> Detail
          </button>
        </div>
        
        ${order.status !== 'completed' ? `
          <button class="action-btn cancel-btn">
            <i class="fas fa-times"></i> Batalkan Pesanan
          </button>
        ` : ''}
      </div>
    `;
    ordersList.appendChild(orderEl);
  });

  // Event listeners
  document.querySelectorAll('.track-btn').forEach(btn => {
    btn.addEventListener('click', trackOrder);
  });
  
  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', confirmCancel);
  });
}

// Filter Orders
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      if (filter === 'all') {
        renderOrders();
      } else {
        const filtered = sampleOrders.filter(order => order.status === filter);
        renderOrders(filtered);
      }
    });
  });
}

// Track Order
function trackOrder(e) {
  const orderId = e.target.closest('.order-card').querySelector('.order-id').textContent;
  showNotification(`Melacak pesanan ${orderId}...`);
}

// Confirm Cancel
function confirmCancel(e) {
  const orderCard = e.target.closest('.order-card');
  const orderId = orderCard.querySelector('.order-id').textContent;
  
  if (confirm(`Batalkan pesanan ${orderId}?`)) {
    orderCard.style.opacity = '0.5';
    orderCard.style.pointerEvents = 'none';
    showNotification(`Pesanan ${orderId} berhasil dibatalkan`);
  }
}

// Show Notification
function showNotification(message) {
  const notification = document.getElementById('notification');
  notification.querySelector('#notification-message').textContent = message;
  notification.classList.remove('notification-hidden');
  notification.classList.add('notification-visible');
  
  setTimeout(() => {
    notification.classList.remove('notification-visible');
    notification.classList.add('notification-hidden');
  }, 3000);
}