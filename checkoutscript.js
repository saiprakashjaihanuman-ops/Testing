//checkoutscript.js
    document.getElementById("checkout-form").addEventListener("submit", function(e){
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
        pincode: document.getElementById("pincode").value
      };

  window.onload = function() {
    const total = localStorage.getItem("orderTotal");
    if (total) {
      document.getElementById("totalAmount").innerText = "Total: ₹" + total;
    } else {
      document.getElementById("totalAmount").innerText = "No total found.";
    }
  };
        
        // Razorpay options
      var options = {
          "key": "rzp_test_RGFvmNP1FiIT6V", // 🔑 Replace with your Razorpay Key ID
          "amount": window.getCartTotal() * 100, // convert ₹ to paise
          "currency": "INR",
          "name": "My Store",
          "description": "Product Purchase",
          "image": "https://yourdomain.com/logo.png",
          "handler": function (response){
              alert("✅ Payment successful!\nPayment ID: " + response.razorpay_payment_id);

              // TODO: send customer details + payment_id to your backend
              console.log("Customer Details:", customer);
          },
          "prefill": {
              "name": customer.name,
              "email": "customer@example.com", // You can add email input too if needed
              "contact": customer.phone
          },
          "theme": {
              "color": "#3399cc"
          }
      };

      var rzp1 = new Razorpay(options);
      rzp1.open();
    });
