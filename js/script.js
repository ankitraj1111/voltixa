
  (function(){
    "use strict";

    // ----- CART with images & quantity -----
    let cart = JSON.parse(localStorage.getItem("voltixaCart")) || [];

    const cartCountSpan = document.getElementById('cart-count');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalSpan = document.getElementById('cart-total');
    const emptyCartMsgDiv = document.getElementById('emptyCartMessage');
    const clearCartBtn = document.getElementById('clearCartBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');

    function saveCart() {
      localStorage.setItem("voltixaCart", JSON.stringify(cart));
    }

    function renderCart() {
      const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      cartCountSpan.textContent = totalItems;

      if (cart.length === 0) {
        cartItemsList.innerHTML = '';
        emptyCartMsgDiv.style.display = 'block';
        cartTotalSpan.textContent = '0';
        return;
      }
      
      emptyCartMsgDiv.style.display = 'none';
      let totalPrice = 0;
      let html = '';
      
      cart.forEach((item, index) => {
        const qty = item.quantity || 1;
        const itemTotal = item.price * qty;
        totalPrice += itemTotal;
        const imgSrc = item.image || 'img/placeholder.jpg';
        
        html += `
          <li class="cart-item">
            <img class="cart-item-img" src="${imgSrc}" alt="${item.name}" onerror="this.src='img/placeholder.jpg';this.onerror=null;">
            <div class="cart-item-details">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
            </div>
            <div class="cart-item-actions">
              <div class="qty-control">
                <button class="qty-decr" data-index="${index}" aria-label="decrease">–</button>
                <span>${qty}</span>
                <button class="qty-incr" data-index="${index}" aria-label="increase">+</button>
              </div>
              <button class="remove-item-btn" data-index="${index}" title="Remove"><i class="fas fa-trash"></i></button>
            </div>
          </li>
        `;
      });
      
      cartItemsList.innerHTML = html;
      cartTotalSpan.textContent = totalPrice.toLocaleString();
      
      document.querySelectorAll('.qty-incr').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.index;
          if (idx !== undefined) incrementQuantity(parseInt(idx));
        });
      });
      document.querySelectorAll('.qty-decr').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.index;
          if (idx !== undefined) decrementQuantity(parseInt(idx));
        });
      });
      document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = btn.dataset.index;
          if (idx !== undefined) removeItem(parseInt(idx));
        });
      });
    }

    function incrementQuantity(index) {
      if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + 1;
        saveCart();
        renderCart();
      }
    }
    function decrementQuantity(index) {
      if (cart[index]) {
        const qty = cart[index].quantity || 1;
        if (qty > 1) {
          cart[index].quantity = qty - 1;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
        renderCart();
      }
    }
    function removeItem(index) {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    }
    function clearCart() {
      cart = [];
      saveCart();
      renderCart();
    }

    function getProductFromElement(btn) {
      const productDiv = btn.closest('.product');
      if (!productDiv) return null;
      const name = productDiv.getAttribute('data-name');
      const price = parseInt(productDiv.getAttribute('data-price'));
      let image = productDiv.getAttribute('data-img');
      if (!image) {
        const imgTag = productDiv.querySelector('img');
        image = imgTag ? imgTag.getAttribute('src') : 'img/placeholder.jpg';
      }
      return { name, price, image };
    }

    // ADD TO CART (no scroll)
    window.addToCart = function(btn) {
      const prod = getProductFromElement(btn);
      if (!prod) return;
      
      const existing = cart.find(item => item.name === prod.name && item.price === prod.price);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        existing.image = prod.image;
      } else {
        cart.push({ name: prod.name, price: prod.price, image: prod.image, quantity: 1 });
      }
      saveCart();
      renderCart();
      
      btn.innerHTML = '<i class="fas fa-check"></i> Added';
      setTimeout(() => btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add', 600);
    };

    window.buyNow = function(btn) {
      const prod = getProductFromElement(btn);
      if (!prod) return;
      const existing = cart.find(item => item.name === prod.name && item.price === prod.price);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
        existing.image = prod.image;
      } else {
        cart.push({ name: prod.name, price: prod.price, image: prod.image, quantity: 1 });
      }
      saveCart();
      renderCart();
      const total = cart.reduce((sum, i) => sum + (i.price * (i.quantity||1)), 0);
      alert(`✅ Buy Now\n\n${prod.name} · ₹${prod.price}\nCart total: ₹${total}\n(Simulated order)`);
    };

    // Search
    function filterProducts() {
      const val = searchInput.value.toLowerCase().trim();
      document.querySelectorAll('.product').forEach(p => {
        const name = p.getAttribute('data-name').toLowerCase();
        p.style.display = (name.includes(val) || val === '') ? '' : 'none';
      });
    }
    searchInput.addEventListener('keyup', filterProducts);
    searchBtn.addEventListener('click', filterProducts);

    function placeOrder() {
      if (cart.length === 0) { alert('Cart is empty!'); return; }
      const total = cart.reduce((s, i) => s + i.price * (i.quantity||1), 0);
      alert(`🎉 Order placed!\nTotal: ₹${total}\nThank you for shopping!`);
      cart = [];
      saveCart();
      renderCart();
    }

    clearCartBtn.addEventListener('click', clearCart);
    placeOrderBtn.addEventListener('click', placeOrder);
    continueShoppingBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    document.getElementById('cartToggle').addEventListener('click', () => {
      document.getElementById('cartPanel').scrollIntoView({ behavior: 'smooth' });
    });

    renderCart();
  })();