// src/pages/Payment.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { API_URL } from "../config";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  useEffect(() => {
    if (!booking) navigate("/", { replace: true });
  }, [booking, navigate]);

  const [customerName, setCustomerName] = useState(booking?.name || "");
  const [email, setEmail] = useState(""); // prefill if available
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi"); // upi | card | netbanking

  const handlePay = async (e) => {
  e.preventDefault();

  if (!customerName || !email || !phone) {
    alert("Please fill customer name, email and phone.");
    return;
  }

  const payload = {
    booking,
    customer: { name: customerName, email, phone },
    paymentMode,
  };

  try {
    // create order on server
    const res = await fetch(`${API_URL}/api/payments/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Ensure response is JSON
    const data = await res.json();
    if (!res.ok || !data.orderId) {
      throw new Error(data.message || "Failed to create order");
    }

    // Open Razorpay checkout
    const options = {
      key: data.key, // your Razorpay key id from server
      amount: data.amount, // in paise
      currency: data.currency,
      name: "Ajuman Holidays",
      description: `${booking.origin} → ${booking.destination}`,
      order_id: data.orderId,
      prefill: { name: customerName, email, contact: phone },
      theme: { color: "#1e3a8a" },

      handler: async function (response) {
        // response contains: razorpay_payment_id, razorpay_order_id, razorpay_signature
        try {
          const verifyRes = await fetch(`${API_URL}/api/payments/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              booking,
              customer: { name: customerName, email, phone },
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyRes.ok && verifyData.success) {
            // success -> navigate to success page
            navigate("/payment-success", { state: { paymentResult: { ...verifyData, booking, customer: { name: customerName, email, phone } } }});
          } else {
            throw new Error(verifyData.message || "Payment verification failed");
          }
        } catch (err) {
          console.error("Verification error:", err);
          alert("Payment verification failed. Please contact support.");
        }
      },

      // optionally handle checkout failure
      modal: {
        ondismiss: function () {
          console.log("Checkout closed by user");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment flow error:", err);
    alert("Payment failed: " + (err.message || err));
  }
};


  if (!booking) return null;

  return (
    <div className="payment-page">
      <h2>Payment</h2>

      <div className="payment-summary">
        <strong>Route:</strong> {booking.origin} → {booking.destination}
      </div>
      <div className="payment-summary">
        <strong>Date:</strong> {booking.date}
      </div>
      <div className="payment-summary">
        <strong>Seats:</strong> {booking.selectedSeats.join(", ")}
      </div>
      <div className="payment-summary">
        <strong>Amount:</strong> ₹ {booking.amount}
      </div>

      <form onSubmit={handlePay} className="payment-form">
        <input
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <div className="payment-methods">
          <label>
            <input type="radio" name="pm" value="upi" checked={paymentMode === "upi"} onChange={() => setPaymentMode("upi")} /> UPI
          </label>
          <label >
            <input type="radio" name="pm" value="card" checked={paymentMode === "card"} onChange={() => setPaymentMode("card")} /> Card
          </label>
          <label >
            <input type="radio" name="pm" value="netbanking" checked={paymentMode === "netbanking"} onChange={() => setPaymentMode("netbanking")} /> Netbanking
          </label>
        </div>

        <button type="submit" >
          Pay Now
        </button>
      </form>
    </div>
  );
}
