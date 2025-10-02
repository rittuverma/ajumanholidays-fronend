import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import "./AddStaffPage.css";

const AddStaffPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "driver", // default
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint =
        formData.role === "driver" ? "drivers" : "supervisors";

      await axios.post(`${API_URL}/${endpoint}`, {
        id: Date.now(),
        ...formData,
      });

      alert(`${formData.role} added successfully ✅`);
      navigate("/admin/staff"); // redirect to staff list
    } catch (err) {
      console.error("Error adding staff:", err);
      alert("Failed to add staff ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-staff-page">
      <h2>Add Driver / Supervisor</h2>
      <form onSubmit={handleSubmit} className="staff-form">
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Role:
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="driver">Driver</option>
            <option value="supervisor">Supervisor</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Add Staff"}
        </button>
      </form>
    </div>
  );
};

export default AddStaffPage;
