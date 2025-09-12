// checkoutscript.js
// Robust checkout script: renders order lines (with correct minQty logic) and integrates Razorpay.
// Copy this file entirely into your checkoutscript.js

(function () {
  // --- Helpers ---
  function getCartFromStorage() {
    const raw = localStorage.getItem("orderCart")
      || localStorage.getItem("cartData")
      || localStorage.getItem("cart")
      || "{}";
    try {
      return JSON.parse(raw || "{}");
    } catch (e) {
      console.error("Failed to parse cart JSON:", e);
      return {};
    }
  }

  function toNumber(v) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }

  // Determine the "unit size" (grams) that the product.price corresponds to.
  // Priority: pricePer -> minQty -> default 100g (for weight items). For combos unitSize=1 (packs).
  function getUnitSize(product) {
    if (!product) return 100;
    if (typeof product.pricePer === "number" && product.pricePer > 0) return product.pricePer;
    if (typeof product.minQty === "number" && product.minQty > 0) return product.minQty;
    return product.type === "combo" ? 1 : 100;
  }

  function formatQtyText(item) {
    if (item.product && item.product.type === "combo") {
      return `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`;
    }
    const q = toNumber(item.quantity);
    return q >= 1000 ? (q / 1000).toFixed(2) + " kg" : q + " g";
  }

  // --- Render order summary (table) with correct subtotal calculation ---
  function renderOrderSummary() {
    const cart = getCartFromStorage();
    const container = document.getElementById("order-items")
      || document.getElementById("order-summary");
    const orderTotalEl = document.getElementById("order-total")
      || document.getElementById("orderTotal");

    if (!container) {
      console.warn('No order summary container found. Expected id="order-items" or id="order-summary" in checkout.html');
      return;
    }

    const keys = Object.keys(cart);
    if (keys.length === 0) {
      container.innerHTML = "<p>Your cart is empty.</p>";
      if (orderTotalEl) orderTotalEl.textContent = "₹0.00";
      localStorage.setItem("orderTotal", "0");
      return;
    }

    let html = '<table style="width:100%;border-collapse:collapse;">' +
      '<thead><tr>' +
      '<th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Item</th>' +
      '<th style="text-align:right;padding:8px;border-bottom:1px solid #ddd">Qty</th>' +
      '<th style="text-align:right;padding:8px;border-bottom:1px solid #ddd">Price</th>' +
      '<th style="text-align:right;padding:8px;border-bottom:1px solid #ddd">Subtotal</th>' +
      '</tr></thead><tbody>';

    let calculatedTotal = 0;

    keys.forEach(productName => {
      const item = cart[productName];
      if (!item || !item.product) return;

      const product = item.product;

      if (product.type === "combo") {
        // packs
        const pricePerPack = toNumber(product.price); // price is per pack
        const qtyPacks = toNumber(item.quantity);
        const subtotal = pricePerPack * qtyPacks;
        calculatedTotal += subtotal;

        html += '<tr>' +
          `<td style="padding:8px;border-bottom:1px solid #f0f0f0">${escapeHtml(productName)}</td>` +
          `<td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0">${formatQtyText(item)}</td>` +
          `<td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0">₹${pricePerPack.toFixed(2)} / pack</td>` +
          `<td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0">₹${subtotal.toFixed(2)}</td>` +
          '</tr>';
      } else {
        // weight-based
        const unitSize = getUnitSize(product); // grams that product.price corresponds to
        const priceForUnit = toNumber(product.price); // price for unitSize (eg for 170g or 250g or 100g)
        const qtyGrams = toNumber(item.quantity); // item.quantity stored as grams in your system
        const units = qtyGrams / unitSize; // e.g., 340g / 170g = 2 units
        const subtotal = units * priceForUnit;
        calculatedTotal += subtotal;

        html += '<tr>' +
          `<td style="padding:8px;border-bottom:1px solid #f0f0f0">${escapeHtml(productName)}</td>` +
          `<td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0">${formatQtyText(item)}</td>` +
          `<td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0">₹${priceForUnit.toFixed(2)} / ${unitSize}g</td>` +
          `<td style="padding:8px;text-align:right;border-bottom:1px solid #f0f0f0">₹${subtotal.toFixed(2)}</td>` +
          '</tr>';
      }
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    if (orderTotalEl) orderTotalEl.textContent = "₹" + calculatedTotal.toFixed(2);

    // Persist the accurate total for Razorpay (saved as number string)
    localStorage.setItem("orderTotal", calculatedTotal.toFixed(2));
  }

  // small helper to avoid HTML injection in table cells (product names)
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  // --- Payment handling ---
  document.addEventListener("DOMContentLoaded", function () {
    // render summary when page loads
    renderOrderSummary();

    const form = document.getElementById("checkout-form");
    if (!form) {
      console.warn("No #checkout-form found on page.");
      return;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Recalculate summary & total right before payment
      renderOrderSummary();
      const total = toNumber(localStorage.getItem("orderTotal") || 0);
      if (total <= 0) {
        alert("Invalid total amount!");
        return;
      }

      // collect customer details
      const customer = {
        name: document.getElementById("name").value || "",
        phone: document.getElementById("phone").value || "",
        email: document.getElementById("email").value || "",
        door: document.getElementById("door").value || "",
        street: document.getElementById("street").value || "",
        area: document.getElementById("area").value || "",
        nearby: document.getElementById("nearby").value || "",
        city: document.getElementById("city").value || "",
        state: document.getElementById("state").value || "",
        pincode: document.getElementById("pincode").value || ""
      };

      // prepare Razorpay options
      const options = {
        key: "rzp_test_RGFvmNP1FiIT6V", // replace with your key for production
        amount: Math.round(total * 100), // paise (rounded)
        currency: "INR",
        name: "Millet Bites",
        description: "Product Purchase",
        handler: function (response) {
          // Payment success: save success details so index.html can show modal
          const cart = getCartFromStorage();
          localStorage.setItem("paymentSuccess", JSON.stringify({
            customer: customer,
            total: total,
            cart: cart,
            paymentId: response.razorpay_payment_id
          }));

          // CLEAR cart and orderTotal only on success
          localStorage.removeItem("orderCart");
          localStorage.removeItem("cartData");
          localStorage.removeItem("cart");
          localStorage.removeItem("orderTotal");

          // Redirect to index where modal will display
          window.location.href = "index.html";
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone
        },
        theme: { color: "#3399cc" },
        modal: {
          // If user closes the razorpay modal without completing payment
          ondismiss: function () {
            localStorage.setItem("paymentFailure", "true");
            // do NOT clear cart; redirect back to index to show failure modal
            window.location.href = "index.html";
          }
        }
      };

      const rzp = new Razorpay(options);

      // also explicitly listen to payment.failed event to catch failures
      rzp.on("payment.failed", function (response) {
        console.error("Razorpay payment.failed:", response);
        localStorage.setItem("paymentFailure", "true");
        window.location.href = "index.html";
      });

      rzp.open();
    });
  });
})();
