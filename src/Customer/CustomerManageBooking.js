import React, { useEffect, useState } from "react";
import CustomerHeader from "./CustomerHeader";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
// import { AuthContext } from "../Context/AuthContext";
import "./CustomerManagebooking.css";


export default function CustomerManageBooking() {
  const navigate = useNavigate();
  const customer = JSON.parse(localStorage.getItem("customer"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ date: "", seats: "" });

  useEffect(() => {
    if (!customer) {
      navigate("/login"); // redirect if not logged in
      return;
    }

    const fetchBookings = async () => {
  try {
    const res = await fetch(`${API_URL}/bookings/${customer.id}`);
    if (!res.ok) throw new Error("Failed to fetch bookings");
    const data = await res.json();
    setBookings(data);
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
  }finally {
        setLoading(false);
      }
};
    fetchBookings();
  }, [customer, navigate]);

   if (loading) return <p>Loading your bookings...</p>;

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    await fetch(`${API_URL}/bookings/${id}`, { method: "DELETE" });
    setBookings(bookings.filter((b) => b.id !== id));
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const updatedBooking = { ...selectedBooking, ...editForm };

      const res = await fetch(`${API_URL}/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });

      if (!res.ok) throw new Error("Failed to update booking");

      // Update bookings list
      setBookings(
        bookings.map((b) => (b.id === selectedBooking.id ? updatedBooking : b))
      );

      setSelectedBooking(updatedBooking);
      setIsEditing(false);
      alert("Booking updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update booking.");
    }
  };

  return (
    <>
      <CustomerHeader />
      <div className="manage-bookings-container">
        <h2 >My Bookings</h2>
        {bookings.length === 0 ? (
          <p className="no-bookings">No bookings found</p>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr >
                <th >Route</th>
                <th >Date</th>
                <th >Status</th>
                <th >Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} >
                  <td >{b.origin} → {b.destination}</td>
                  <td >{b.date}</td>
                  <td>
              <span className={`status-badge ${
                b.status === "Confirmed"
                  ? "status-confirmed"
                  : b.status === "Cancelled"
                  ? "status-cancelled"
                  : "status-pending"
              }`}>
                {b.status || "Pending"}
              </span>
            </td>
                  <td >
                  <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedBooking(b);
                        setEditForm({ date: b.date, seats: b.seats || "" });
                      }}
                    >
                      View Details
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancel(b.id)}
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* 🔹 Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Booking Details</h3>

            {!isEditing ? (
              <>
            <p><strong>Route:</strong> {selectedBooking.origin} → {selectedBooking.destination}</p>
            <p><strong>Date:</strong> {selectedBooking.date}</p>
            <p><strong>Status:</strong> {selectedBooking.status}</p>
            <p><strong>Customer Name:</strong> {selectedBooking.customerName}</p>
            <p><strong>Email:</strong> {selectedBooking.email}</p>
            <p><strong>Seats:</strong> {selectedBooking.seats || "N/A"}</p>
            <div className="modal-actions">
              <button className="view-btn" onClick={() => setIsEditing(true)}>
                    Edit Booking
                  </button>
              <button className="close-btn" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
            </>
            ) : (
              <>
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                />
                <label>Seats</label>
                <input
                  type="number"
                  name="seats"
                  min="1"
                  value={editForm.seats}
                  onChange={handleEditChange}
                />
                <div className="modal-actions">
                  <button className="view-btn" onClick={handleSaveEdit}>
                    Save Changes
                  </button>
                  <button className="close-btn" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
