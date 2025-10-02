import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function ManageBooking() {
  const [searchValue, setSearchValue] = useState("");
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const customer = JSON.parse(localStorage.getItem("customer"));
    // 🔒 If not logged in → redirect
    if (!customer) {
      alert("Please login to manage your booking.");
      navigate("/login");
      return;
    }
    if (!searchValue.trim()) {
      setError("Please enter a booking ID or email.");
      return;
    }
    // If logged in, continue search
    fetch(`http://localhost:3000/api/bookings/search?query=${searchValue}`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => {
        setBooking(data);
        setError("");
      })
      .catch(() => {
        setBooking(null);
        setError("No booking found with the provided details.");
      });
  };

  const handleCancel = () => {
    if (!booking) return;
    fetch(`http://localhost:3000/api/bookings/${booking.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Cancel failed");
        alert("Booking cancelled successfully.");
        setBooking(null);
      })
      .catch(() => alert("Error cancelling booking."));
  };

  const handleReschedule = () => {
    if (!booking) return;
    const newDate = prompt("Enter new booking date (YYYY-MM-DD):", booking.date);
    if (!newDate) return;

    fetch(`http://localhost:3000/api/bookings/${booking.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...booking, date: newDate }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Reschedule failed");
        alert("Booking rescheduled successfully.");
        setBooking({ ...booking, date: newDate });
      })
      .catch(() => alert("Error rescheduling booking."));
  };

  return (
    <>
      <Header />

      <div
        style={{
          padding: "40px 20px",
          minHeight: "80vh",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "white",
        }}
      >
        <h2 style={{ marginBottom: "10px", fontSize: "2rem", fontWeight: "bold" }}>
          Manage Your Booking
        </h2>
        <p style={{ marginBottom: "30px", opacity: 0.8 }}>
        Enter your booking ID or email to view, reschedule, or cancel.
        </p>
      {/* Search Bar */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
            background: "rgba(255, 255, 255, 0.1)",
            padding: "10px",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <input
            type="text"
            placeholder="Booking ID or Email"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              padding: "10px 15px",
              border: "none",
              outline: "none",
              borderRadius: "8px",
              flex: 1,
              background: "rgba(255, 255, 255, 0.2)",
              color: "white",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: "linear-gradient(90deg, #ff7e5f, #feb47b)",
              border: "none",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = 0.8)}
            onMouseOut={(e) => (e.target.style.opacity = 1)}
          >
            Search
          </button>
        </div>

        {error && <p style={{ color: "#ff4d4d", marginBottom: "20px" }}>{error}</p>}

        {/* Booking Card */}
        {booking && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "20px",
              borderRadius: "15px",
              maxWidth: "400px",
              width: "100%",
              textAlign: "left",
              boxShadow: "0px 4px 15px rgba(0,0,0,0.3)",
              animation: "fadeIn 0.5s ease-in-out",
            }}
          >
            <h4 style={{ marginBottom: "10px" }}>Booking Details</h4>
            <p><strong>ID:</strong> {booking.id}</p>
            <p><strong>Name:</strong> {booking.customerName}</p>
            <p><strong>Route:</strong> {booking.route}</p>
            <p><strong>Date:</strong> {booking.date}</p>
            <p><strong>Status:</strong> {booking.status}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={handleReschedule}
                style={{
                  background: "linear-gradient(90deg, #36d1dc, #5b86e5)",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Reschedule
              </button>
              <button
                onClick={handleCancel}
                style={{
                  background: "linear-gradient(90deg, #ff4e50, #f9d423)",
                  border: "none",
                  padding: "10px",
                  borderRadius: "8px",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
