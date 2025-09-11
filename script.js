//script.js
    let slideIndex = 1;
    let slideTimer;

    function showSlides(n) {
      const slides = document.querySelectorAll(".slides");
      const dots = document.querySelectorAll(".dot");

      if (n > slides.length) slideIndex = 1;
      if (n < 1) slideIndex = slides.length;

      slides.forEach(slide => slide.style.display = "none");
      dots.forEach(dot => dot.classList.remove("active-dot"));

      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].classList.add("active-dot");
    }

    function nextSlide() {
      slideIndex++;
      showSlides(slideIndex);
    }

    function currentSlide(n) {
      clearTimeout(slideTimer);
      slideIndex = n;
      showSlides(slideIndex);
      autoSlides();
    }

    function autoSlides() {
      slideTimer = setTimeout(() => {
        nextSlide();
        autoSlides();
      }, 5000);
    }

    document.addEventListener("DOMContentLoaded", () => {
      showSlides(slideIndex);
      autoSlides();

      const dots = document.querySelectorAll(".dot");
      dots.forEach(dot => {
        dot.addEventListener("click", () => {
          const index = parseInt(dot.getAttribute("data-index"));
          currentSlide(index);
        });
      });
    });
  
const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, type: "combo", category: "combo" },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, type: "combo", category: "combo" },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, type: "combo", category: "combo" },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, type: "combo", category: "combo" },

  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Jowar Murukkulu", image: "Jowar Murukkulu.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Jowar Ribbon Pakodi", image: "Jowar Ribbon Pakodi.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Foxtail Sev", image: "Foxtail Sev.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Arikalu Jantikalu", image: "Arikalu Jantikalu.jpeg", price: 60, type: "weight", category: "hots" },
  { name: "Samalu Boondi", image: "Samalu Boondi.jpeg", price: 60, type: "weight", category: "hots" },

  { name: "Dry Fruit Mixture", image: "Dry Fruit Mixture.jpeg", price: 180, type: "weight", category: "dryfruits" },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 300, type: "weight", category: "sweets", minQty: 250, pricePer: 250 },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 200, type: "weight", category: "dryfruits", minQty: 170, pricePer: 170 },
  { name: "Panchadara Gavvalu", image: "Panchadara Gavvalu.jpg", price: 100, type: "weight", category: "sweets", minQty: 250, pricePer: 250 },
  { name: "Bellam Gavvalu", image: "Bellam Gavvalu.jpeg", price: 100, type: "weight", category: "sweets", minQty: 250, pricePer: 250 },
  { name: "Hot Gavvalu", image: "Hot Gavvalu.jpeg", price: 100, type: "weight", category: "hots", minQty: 250, pricePer: 250 }
];

function showCategory(category) {
  const filtered = products.filter(p => p.category === category);
  renderFilteredProducts(filtered);
}

    const cart = {};

// 1. Get unique categories from products
const categories = [...new Set(products.map(p => p.category))];

function renderCategories() {
  const categoryGrid = document.getElementById("category-grid");
  categoryGrid.innerHTML = "";

  // Add "All Products" card first
const allCard = document.createElement("div");
allCard.className = "product-card";
allCard.style.cursor = "pointer";
allCard.innerHTML = `<h4>All Products</h4>`;
allCard.addEventListener("click", () => renderProductsByCategory("all"));

categoryGrid.appendChild(allCard);

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.style.cursor = "pointer";
    div.innerHTML = `<h4>${cat.toUpperCase()}</h4>`;
    div.addEventListener("click", () => renderProductsByCategory(cat));
    categoryGrid.appendChild(div);
  });
}

function renderProductsByCategory(category) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const filtered = category === "all" ? products : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const div = document.createElement("div");
    div.className = "product-card";

    if (product.type === "combo") {
      div.innerHTML = `
        <div class="discount-badge">Best Offer</div>
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price} - pack</p>
        <div class="quantity-controls">
          <button onclick="removeFromCart('${product.name}')">-</button>
          <select id="select-${product.name}">
            ${[1,2,3,5].map(p => `<option value="${p}">${p} Pack${p>1?'s':''}</option>`).join('')}
          </select>
          <button onclick="addToCart('${product.name}')">+</button>
        </div>
        <div class="cart-status" id="status-${product.name}"></div>
      `;
    } else {
      const quantityOptions = product.name === "Cashew Bar" 
  ? [
      { value: 170, label: "170g" },
      { value: 250, label: "250g" },
      { value: 500, label: "500g" },
      { value: 1000, label: "1KG" }
    ]
      :product.minQty === 250 ? [
        { value: 250, label: "250g" },
        { value: 500, label: "500g" },
        { value: 1000, label: "1KG" }
      ] : [
        { value: 100, label: "100g" },
        { value: 250, label: "250g" },
        { value: 500, label: "500g" },
        { value: 1000, label: "1KG" }
      ];

      div.innerHTML = `
        <div class="discount-badge">20% OFF</div>
        <img src="${product.image}" alt="${product.name}" />
        <h4>${product.name}</h4>
        <p>₹${product.price} - ${product.minQty===250?'250g':'100g'}</p>
        <div class="quantity-controls">
          <button onclick="removeFromCart('${product.name}')">-</button>
          <select id="select-${product.name}">
            ${quantityOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
          </select>
          <button onclick="addToCart('${product.name}')">+</button>
        </div>
        <div class="cart-status" id="status-${product.name}"></div>
      `;
    }

    grid.appendChild(div);
  });
}

    function addToCart(productName) {
      const product = products.find(p => p.name === productName);
      if (!product) return;
      
      const selectElement = document.getElementById(`select-${productName}`);
      const value = parseInt(selectElement.value);
      
      if (!cart[productName]) {
        cart[productName] = {
          product: product,
          quantity: 0,
          unit: product.type === "combo" ? "pack" : "g"
        };
      }
      
      if (product.type === "combo") {
        cart[productName].quantity += value;
      } else {
        cart[productName].quantity += value;
      }
      
      updateStatus(productName);
      updateCartDisplay();
      updateCartCount();
    }

    function removeFromCart(productName) {
      const product = products.find(p => p.name === productName);
      if (!product || !cart[productName]) return;
      
      const selectElement = document.getElementById(`select-${productName}`);
      const value = parseInt(selectElement.value);
      
      cart[productName].quantity -= value;
      
      if (cart[productName].quantity <= 0) {
        delete cart[productName];
      }
      
      updateStatus(productName);
      updateCartDisplay();
      updateCartCount();
    }

    function updateStatus(productName) {
      const status = document.getElementById(`status-${productName}`);
      if (cart[productName]) {
        const item = cart[productName];
        if (item.product.type === "combo") {
          status.textContent = `In cart: ${item.quantity} Pack${item.quantity > 1 ? 's' : ''}`;
        } else {
          status.textContent = `In cart: ${item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + ' kg' : item.quantity + ' g'}`;
        }
      } else {
        status.textContent = "";
      }
    }

    function updateCartCount() {
      const count = Object.keys(cart).length;
      document.getElementById("cartCount").textContent = count;
      const cartCount2 = document.getElementById("cartCount2");
      if (cartCount2) cartCount2.textContent = count;
    }

    function updateCartDisplay() {
      const cartItemsContainer = document.getElementById("panel-cart-items");
      let total = 0;
      
      if (Object.keys(cart).length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        document.querySelector(".cart-summary p").textContent = `Total: ₹0.00`;
        return;
      }
      
      let cartItemsHTML = '';
      for (const productName in cart) {
        const item = cart[productName];
        let itemTotal = 0;
        let qtyControls = "";
        
        if (item.product.type === "combo") {
          itemTotal = item.quantity * item.product.price;
          qtyControls = `
            <button onclick="adjustCartItem('${productName}', -1)">-</button>
            ${item.quantity} Pack${item.quantity > 1 ? 's' : ''}
            <button onclick="adjustCartItem('${productName}', 1)">+</button>
          `;
        } else {
          // For weight-based items, check if price is per 100g or per 250g
          if (item.product.pricePer === 250) {
            // Price is per 250g
            itemTotal = (item.quantity / 250) * item.product.price;
          } else {
            // Default to price per 100g
            itemTotal = (item.quantity / 100) * item.product.price;
          }
          
          qtyControls = `
            <button onclick="adjustCartItem('${productName}', -${item.product.minQty === 250 ? 250 : 100})">-</button>
            ${item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + ' kg' : item.quantity + ' g'}
            <button onclick="adjustCartItem('${productName}', ${item.product.minQty === 250 ? 250 : 100})">+</button>
          `;
        }
        
        total += itemTotal;
        
        cartItemsHTML += `
          <div class="cart-item">
            <div class="cart-item-name">${productName}</div>
            <div class="cart-item-qty">${qtyControls}</div>
            <div class="cart-item-price">₹${itemTotal.toFixed(2)}</div>
          </div>
        `;
      }
      
      cartItemsContainer.innerHTML = cartItemsHTML;
      document.querySelector(".cart-summary p").textContent = `Total: ₹${total.toFixed(2)}`;
      document.dispatchEvent(new Event("cartUpdated"));
    }

    function adjustCartItem(productName, adjustment) {
      if (!cart[productName]) return;
      
      cart[productName].quantity += adjustment;
      
      if (cart[productName].quantity <= 0) {
        delete cart[productName];
      }
      
      updateStatus(productName);
      updateCartDisplay();
      updateCartCount();
    }

    function toggleCartPanel() {
      document.getElementById("cartPanel").classList.toggle("active");
      document.getElementById("overlay").classList.toggle("active");
    }

    function sendOrder() {
      if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
      }
      
      let msg = "Hello! I'd like to order:\n\n";
      
      for (const productName in cart) {
        const item = cart[productName];
        if (item.product.type === "combo") {
          msg += `${productName}: ${item.quantity} Pack${item.quantity > 1 ? 's' : ''}\n`;
        } else {
          msg += `${productName}: ${item.quantity >= 1000 ? (item.quantity/1000).toFixed(2) + ' kg' : item.quantity + ' g'}\n`;
        }
      }
      
      // Calculate total
      let total = 0;
      for (const productName in cart) {
        const item = cart[productName];
        if (item.product.type === "combo") {
          total += item.quantity * item.product.price;
        } else {
          // For weight-based items, check if price is per 100g or per 250g
          if (item.product.pricePer === 250) {
            total += (item.quantity / 250) * item.product.price;
          } else {
            total += (item.quantity / 100) * item.product.price;
          }
        }
      }
      
      msg += `\nTotal: ₹${total.toFixed(2)}\n\nPlease confirm my order.`;
      
      const encodedMsg = encodeURIComponent(msg);
      window.open(`https://wa.me/919949840365?text=${encodedMsg}`, "_blank");
    }

    document.addEventListener("DOMContentLoaded", () => {
      renderCategories();
      renderProductsByCategory("all");
      
      // Cart panel toggle
      document.getElementById("cartIcon").addEventListener("click", toggleCartPanel);
      document.getElementById("cartIcon2").addEventListener("click", toggleCartPanel);
      document.getElementById("closeCart").addEventListener("click", toggleCartPanel);
      document.getElementById("overlay").addEventListener("click", toggleCartPanel);
      
      // Clear cart button
      document.querySelector(".clear").addEventListener("click", () => {
        for (const productName in cart) {
          delete cart[productName];
          updateStatus(productName);
        }
        updateCartDisplay();
        updateCartCount();
      });
    });
