// ✅ Get order details from localStorage
var total = parseFloat(localStorage.getItem("orderTotal")) || 0;
var orderCart = JSON.parse(localStorage.getItem("orderCart")) || {};

// ✅ Render order summary
function renderOrderSummary() {
  const orderItemsDiv = document.getElementById("order-items");
  const orderTotalP = document.getElementById("order-total");

  if (Object.keys(orderCart).length === 0) {
    orderItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    orderTotalP.textContent = "Total: ₹0.00";
    return;
  }

  let html = "<ul>";
  for (const productName in orderCart) {
    const item = orderCart[productName];
    let qtyText = item.product.type === "combo"
      ? `${item.quantity} Pack${item.quantity > 1 ? "s" : ""}`
      : item.quantity >= 1000
        ? (item.quantity / 1000).toFixed(2) + " kg"
        : item.quantity + " g";

    html += `<li>${productName} - ${qtyText}</li>`;
  }
  html += "</ul>";

  orderItemsDiv.innerHTML = html;
  orderTotalP.textContent = `Total: ₹${total.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", renderOrderSummary);

// ✅ Handle payment
document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();

  var customer = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    door: document.getElementById("door").value,
    street: document.getElementById("street").value,
    area: document.getElementById("area").value,
    nearby: document.getElementById("nearby").value,
    city: document.getElementById("city").value,
    state: document.getElementById("state").value,
    pincode: document.getElementById("pincode").value,
  };

  if (total <= 0) {
    alert("Invalid total amount!");
    return;
  }

  var options = {
    key: "rzp_test_RGFvmNP1FiIT6V", // Replace with your Razorpay Key
    amount: parseInt(total) * 100, // Convert to paise
    currency: "INR",
    name: "Millet Bites",
    description: "Product Purchase",
    handler: function (response) {
      alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);

      console.log("Customer Details:", customer);
      console.log("Order Cart:", orderCart);
      console.log("Payment Response:", response);

      // Clear storage after success
      localStorage.removeItem("orderTotal");
      localStorage.removeItem("orderCart");
    },
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone,
    },
    theme: {
      color: "#3399cc",
    },
  };

  var rzp1 = new Razorpay(options);
  rzp1.open();
});
