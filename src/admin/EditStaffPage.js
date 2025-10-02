import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./EditStaffPage.css";

const EditStaffPage = () => {
  const { role, id } = useParams(); // role = driver | supervisor
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch staff details
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await axios.get(`${API_URL}/${role}s/${id}`);
        setStaff(res.data);
      } catch (err) {
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [role, id]);

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/${role}s/${id}`, staff);
      alert("✅ Staff updated successfully!");
      navigate("/admin/staff"); // redirect back to staff list page
    } catch (err) {
      console.error("Error updating staff:", err);
      alert("❌ Failed to update staff");
    }
  };

  if (loading) return <p className="loading">Loading staff details...</p>;

  return (
    <div className="edit-staff-page">
      <h2>Edit {role === "driver" ? "Driver" : "Supervisor"} Details</h2>
      <form onSubmit={handleSubmit} className="edit-staff-form">
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={staff.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email Address:
          <input
            type="email"
            name="email"
            value={staff.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phone"
            value={staff.phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Years of Experience:
          <input
            type="number"
            name="experience"
            value={staff.experience}
            onChange={handleChange}
            min="0"
            max="50"
          />
        </label>
        <button type="submit" className="save-btn">💾 Save Changes</button>
      </form>
    </div>
  );
};

export default EditStaffPage;
