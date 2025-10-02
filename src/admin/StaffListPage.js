import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "./StaffListPage.css";

const StaffListPage = () => {
  const [drivers, setDrivers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStaff = async () => {
    try {
      const driversRes = await axios.get(`${API_URL}/drivers`);
      const supervisorsRes = await axios.get(`${API_URL}/supervisors`);
      setDrivers(driversRes.data);
      setSupervisors(supervisorsRes.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, role) => {
    if (!window.confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await axios.delete(`${API_URL}/${role}/${id}`);
      alert("Staff deleted successfully ✅");
      fetchStaff();
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  if (loading) return <p className="loading">Loading staff...</p>;

  return (
    <div className="staff-list-page">
      <h2>Staff Management</h2>
      <button className="add-btn" onClick={() => navigate("/admin/add-staff")}>
        ➕ Add New Staff
      </button>

      <div className="staff-section">
        <h3>Drivers</h3>
        {drivers.length === 0 ? (
          <p>No drivers found.</p>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.email}</td>
                  <td>{d.phone}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/edit-staff/driver/${drivers.id}`)}>✏ Edit</button>
                    <button onClick={() => handleDelete(d.id, "drivers")}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="staff-section">
        <h3>Supervisors</h3>
        {supervisors.length === 0 ? (
          <p>No supervisors found.</p>
        ) : (
          <table className="staff-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {supervisors.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>
                    <button onClick={() => navigate(`/admin/edit-staff/supervisor/${supervisors.id}`)}>✏ Edit</button>
                    <button onClick={() => handleDelete(s.id, "supervisors")}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffListPage;
