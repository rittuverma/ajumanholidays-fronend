import React, { useState, useEffect } from 'react';
import { API_URL } from "../config";

fetch(`${API_URL}/routes`);

export default function BookingModal({ isOpen, onClose, route }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    route: '',
    fare: '',
    time: '',
  });

  // Prefill when modal opens or route changes
  useEffect(() => {
    if (route) {
      setFormData((prev) => ({
        ...prev,
        route: `${route.from} to ${route.to}`,
        fare: route.fare,
        time: `${route.departure} - ${route.arrival}`,
      }));
    }
  }, [route]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save booking to backend here
    console.log('Booking Submitted:', formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Book This Route</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            name="route"
            value={formData.route}
            readOnly
          />
          <input
            name="fare"
            value={`₹${formData.fare}`}
            readOnly
          />
          <input
            name="time"
            value={formData.time}
            readOnly
          />
          <button type="submit">Confirm Booking</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
