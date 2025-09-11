//checkoutscript.js
document.getElementById("checkout-form").addEventListener("submit", function (e) {
  e.preventDefault();

  // Collect form data
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

  // ✅ Get total from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const total = urlParams.get("total") || 0;

  // ✅ Ensure amount is > 0
  if (total <= 0) {
    alert("Invalid total amount!");
    return;
  }

  // Razorpay Options
  var options = {
    key: "rzp_test_RGFvmNP1FiIT6V", // Replace with your Key ID
    amount: parseInt(total) * 100, // paise
    currency: "INR",
    name: "My Store",
    description: "Product Purchase",
    image: "https://yourdomain.com/logo.png",
    handler: function (response) {
      alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);
      console.log("Customer Details:", customer);
      console.log("Payment Response:", response);
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

  // ✅ Always call Razorpay constructor inside event handler
  var rzp1 = new Razorpay(options);
  rzp1.open();

  // ✅ Prevent form from submitting
  e.preventDefault();
});
