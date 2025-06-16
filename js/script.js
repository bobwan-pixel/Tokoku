// script.js - Improved Version

// Add these utility functions
async function loadComponent(componentId, url) {
  try {
    const container = document.getElementById(componentId);
    if (!container) throw new Error(`Container ${componentId} not found`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    
    container.innerHTML = await response.text();
    return true;
  } catch (error) {
    console.error(`Error loading ${componentId}:`, error);
    throw error;
  }
}

function showLoading(show = true) {
  const loader = document.getElementById('global-loader') || createGlobalLoader();
  loader.style.display = show ? 'flex' : 'none';
}

function createGlobalLoader() {
  const loader = document.createElement('div');
  loader.id = 'global-loader';
  loader.innerHTML = `
    <div class="loader-spinner"></div>
    <p class="loader-text">Memuat...</p>
  `;
  document.body.appendChild(loader);
  return loader;
}

// Modified header loading
async function loadDynamicHeader() {
  showLoading(true);
  try {
    await loadComponent('header-container', 'header.html');
    initializeHeaderEvents();
    updateCartBadge();
  } catch (error) {
    showError('Gagal memuat header', error);
  } finally {
    showLoading(false);
  }
}

// Enhanced cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || {};

function persistCart() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      showError('Penyimpanan penuh. Beberapa fitur mungkin tidak berfungsi');
    }
  }
}

// New error handling
function showError(message, error = null) {
  console.error(message, error);
  
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.innerHTML = `
    <i class="fas fa-exclamation-circle"></i>
    <span>${message}</span>
    <button class="toast-close">&times;</button>
  `;
  
  document.body.appendChild(toast);
  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });
  
  setTimeout(() => toast.remove(), 5000);
}