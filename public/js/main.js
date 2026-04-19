document.addEventListener('DOMContentLoaded', () => {

  // ==================== MOBILE NAV ====================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
      });
    });
  }

  // ==================== TOAST SYSTEM ====================
  window.showToast = function(message, type = 'default') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  };

  // ==================== SCROLL ANIMATIONS ====================
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

  // ==================== NAVBAR SCROLL EFFECT ====================
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & passed header -> hide navbar (move up)
        navbar.style.top = '-100px';
      } else {
        // Scrolling up or at top -> show navbar
        navbar.style.top = '15px';
        if (currentScrollY > 50) {
          navbar.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)';
        } else {
          navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }
      }
      lastScrollY = currentScrollY;
    });
  }

  // ==================== CART SYSTEM ====================
  const cartState = JSON.parse(localStorage.getItem('cartState')) || [];
  
  function saveCart() {
    localStorage.setItem('cartState', JSON.stringify(cartState));
    renderCart();
  }

  function addToCart(id, name, price) {
    const existing = cartState.find(i => i.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cartState.push({ id, name, price: parseFloat(price), qty: 1 });
    }
    saveCart();
    showToast(`✅ Added "${name}" to cart`, 'success');
  }

  function updateQty(id, delta) {
    const item = cartState.find(i => i.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        cartState.splice(cartState.indexOf(item), 1);
        showToast('🗑️ Item removed from cart', 'default');
      }
      saveCart();
    }
  }

  function renderCart() {
    const cartEl = document.getElementById('cart-items');
    const summaryEl = document.getElementById('cartSummary');
    
    if (!cartEl || !summaryEl) return;

    if (cartState.length === 0) {
      cartEl.innerHTML = '<p class="empty-cart-msg text-center">Your cart is empty.</p>';
      summaryEl.style.display = 'none';
      return;
    }

    summaryEl.style.display = 'block';
    cartEl.innerHTML = '';
    let subtotal = 0;

    cartState.forEach(item => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
        </div>
        <div class="cart-item-actions">
          <button class="cart-btn decr-btn" data-id="${item.id}">−</button>
          <span class="cart-qty">${item.qty}</span>
          <button class="cart-btn incr-btn" data-id="${item.id}">+</button>
        </div>
      `;
      cartEl.appendChild(div);
    });

    document.getElementById('cartSubtotal').innerText = `$${subtotal.toFixed(2)}`;
    const tax = subtotal * 0.08;
    document.getElementById('cartTax').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('cartTotal').innerText = `$${(subtotal + tax).toFixed(2)}`;

    // Rebind action buttons
    document.querySelectorAll('.incr-btn').forEach(b => {
      b.addEventListener('click', (e) => updateQty(e.target.dataset.id, 1));
    });
    document.querySelectorAll('.decr-btn').forEach(b => {
      b.addEventListener('click', (e) => updateQty(e.target.dataset.id, -1));
    });
  }

  // Bind "Add to Cart" / "Buy Now" buttons 
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const { id, name, price } = e.target.dataset;
      addToCart(id, name, price);

      // Add tiny pop animation
      e.target.style.transform = 'scale(0.9)';
      setTimeout(() => e.target.style.transform = 'scale(1)', 150);
    });
  });

  // Handle Checkout
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      if (cartState.length === 0) return;
      
      checkoutBtn.innerText = 'Processing...';
      checkoutBtn.disabled = true;
      const subtotal = cartState.reduce((sum, i) => sum + (i.price * i.qty), 0);
      const total = subtotal + subtotal * 0.08;

      try {
        const res = await fetch('/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cartItems: cartState, total })
        });
        const data = await res.json();

        if (res.ok) {
          showToast('🎉 Order Placed Successfully!', 'success');
          cartState.length = 0;
          saveCart();
        } else {
          showToast(data.error || 'Checkout failed', 'error');
        }
      } catch (err) {
        showToast('Server error during checkout', 'error');
      } finally {
        checkoutBtn.innerText = '🎉 Place Order';
        checkoutBtn.disabled = false;
      }
    });
  }

  // Initial render
  renderCart();
});
