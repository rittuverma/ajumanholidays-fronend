// src/admin/BusEditPage.js
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./BusDetailsPage.css"; // reuse same styles

const BusEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  // fetchBus defined before useEffect and memoized so it has a stable identity
  const fetchBus = useCallback(async () => {
    if (!id) return;
    try {
      const res = await axios.get(`${API_URL}/buses/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching bus:", err);
    }
  }, [id]);

  useEffect(() => {
    fetchBus();
  }, [fetchBus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/buses/${id}`, form);
      alert("Bus updated successfully!");
      navigate("/admin/bus-details");
    } catch (err) {
      console.error("Error updating bus:", err);
      alert("Failed to update bus. See console for details.");
    }
  };

  if (!form) return <p>Loading bus details...</p>;

  return (
    <div className="bus-info-page">
      <h2>Edit Bus</h2>
      <form onSubmit={handleSubmit}>
        <label>Bus Name:</label>
        <input name="name" value={form.name || ""} onChange={handleChange} required />

        <label>Serial Number:</label>
        <input
          name="serialNumber"
          value={form.serialNumber || ""}
          onChange={handleChange}
          required
        />

        <label>Registration Number:</label>
        <input
          name="registrationNumber"
          value={form.registrationNumber || ""}
          onChange={handleChange}
          required
        />

        <label>Type:</label>
        <input name="type" value={form.type || ""} onChange={handleChange} />

        <label>Seat Capacity (1–100):</label>
        <input
          type="number"
          name="seatCapacity"
          min="1"
          max="100"
          value={form.seatCapacity ?? ""}
          onChange={handleChange}
        />

        <label>From:</label>
        <input name="from" value={form.from || ""} onChange={handleChange} required />

        <label>To:</label>
        <input name="to" value={form.to || ""} onChange={handleChange} required />

        <label>Driver Name:</label>
        <input
          name="driverName"
          value={form.driverName || ""}
          onChange={handleChange}
        />

        <label>Supervisor Name:</label>
        <input
          name="supervisorName"
          value={form.supervisorName || ""}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default BusEditPage;
