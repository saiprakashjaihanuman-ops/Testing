var total = localStorage.getItem("orderTotal") || 0;
total = parseFloat(total);


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
  key: "rzp_test_RGFvmNP1FiIT6V",
  amount: parseInt(total) * 100, // convert to paise
  currency: "INR",
  name: "My Store",
  description: "Product Purchase",
  handler: function (response) {
    alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);
    console.log("Customer Details:", customer);
    console.log("Payment Response:", response);

    // clear localStorage after success
    localStorage.removeItem("orderTotal");
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
