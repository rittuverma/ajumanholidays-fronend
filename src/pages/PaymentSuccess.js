// src/pages/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to read payment/result object passed from Payment page
  // Expect shape similar to: { paymentResult: { orderId, status, amount, booking: { origin, destination, date, selectedSeats }, customer: {name, email, phone} } }
  const result = location.state?.paymentResult || location.state?.payment || null;

  // If no data, redirect to home after a short delay
  useEffect(() => {
    if (!result) {
      const t = setTimeout(() => navigate("/", { replace: true }), 1800);
      return () => clearTimeout(t);
    }
  }, [result, navigate]);

  if (!result) {
    return (
      <div className="ps-page">
        <div className="ps-card">
          <div className="ps-check success-placeholder" />
          <h2>Payment information not found</h2>
          <p>Redirecting to homepage…</p>
        </div>
      </div>
    );
  }

  // normalize fields (different payment providers may use different keys)
  const paymentId =
    result.paymentId ||
    result.id ||
    result.orderId ||
    result.order_id ||
    result.razorpay_payment_id ||
    null;
  const orderId =
    result.orderId ||
    result.order_id ||
    result.razorpay_order_id ||
    result.id ||
    null;

  // renamed to avoid 'assigned but never used' lint warning and to be explicit
  const paymentStatus = result.status || "success";

  // amount might be in smallest currency unit for some providers — keep as-is but guard
  const rawAmount =
    result.amount ||
    (result.booking && (result.booking.amount || result.booking.totalAmount)) ||
    result.totalAmount ||
    0;

  // if amount looks like paise (large integer and divisible by 100), you might want to convert.
  // but avoid changing original data — just present it sensibly:
  const amount =
    typeof rawAmount === "number"
      ? rawAmount
      : parseFloat(rawAmount) || 0;

  const booking = result.booking || result.order || result.bookingDetails || null;
  const customer = result.customer || (booking && booking.customer) || null;

  return (
    <div className="ps-page">
      <div className="ps-card">
        <div className="ps-check">✔</div>

        <h2>Payment Successful</h2>
        <p className="ps-sub">Thank you — your payment was processed successfully.</p>

        <div className="ps-summary">
          <div className="ps-row">
            <div className="label">Payment ID</div>
            <div className="value">{paymentId || "—"}</div>
          </div>

          <div className="ps-row">
            <div className="label">Order / Reference</div>
            <div className="value">{orderId || "—"}</div>
          </div>

          <div className="ps-row">
            <div className="label">Status</div>
            <div className="value" style={{ textTransform: "capitalize" }}>
              {paymentStatus || "—"}
            </div>
          </div>

          <div className="ps-row">
            <div className="label">Amount</div>
            <div className="value">₹ {amount}</div>
          </div>

          {booking && (
            <>
              <hr />
              <div className="ps-row">
                <div className="label">Route</div>
                <div className="value">
                  {(booking.origin || booking.from) &&
                    `${booking.origin || booking.from} → ${booking.destination || booking.to}`}
                  {!(booking.origin || booking.from) && "—"}
                </div>
              </div>

              <div className="ps-row">
                <div className="label">Date</div>
                <div className="value">{booking.date || booking.travelDate || "—"}</div>
              </div>

              <div className="ps-row">
                <div className="label">Seats</div>
                <div className="value">
                  {(booking.selectedSeats && booking.selectedSeats.join(", ")) ||
                    (booking.seats && (Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats.toString())) ||
                    "—"}
                </div>
              </div>
            </>
          )}

          {customer && (
            <>
              <hr />
              <div className="ps-row">
                <div className="label">Passenger</div>
                <div className="value">{customer.name || "—"}</div>
              </div>
              <div className="ps-row">
                <div className="label">Contact</div>
                <div className="value">{customer.phone || customer.email || "—"}</div>
              </div>
            </>
          )}
        </div>

        <div className="ps-actions">
          <button className="btn primary" onClick={() => navigate("/customer/manage-booking")}>
            View My Bookings
          </button>
          <button className="btn" onClick={() => navigate("/")}>Back to Home</button>
        </div>

        <p className="ps-note">
          We have also sent a confirmation email (if provided). If you need help, contact support.
        </p>
      </div>
    </div>
  );
}
