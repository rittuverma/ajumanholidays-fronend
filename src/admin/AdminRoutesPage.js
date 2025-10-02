import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminRoutesPage.css";
import { API_URL } from "../config";

const AdminRoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
      from: "",
      to: "", 
      price: "", 
      time: "", 
      image: "" 
    });

    // Fetch routes
    const fetchRoutes = async () => {
    try {
      const res = await axios.get(`${API_URL}/routes`);
      setRoutes(res.data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  
  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add new route
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await fetch(`${API_URL}/routes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormData({ from: "", to: "", price: "", time: "", image: "" });
      fetchRoutes();
    } catch (err) {
      console.error("Error adding route:", err);
    }
  };

  // Save updated route
  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/routes/${editingRoute}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setEditingRoute(null);
      setFormData({ from: "", to: "", price: "", time: "", image: "" });
      fetchRoutes();
    } catch (err) {
      console.error("Error updating route:", err);
    }
  };

  // Delete route
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      await axios.delete(`${API_URL}/routes/${id}`);
      fetchRoutes();
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route.id);
    setFormData(route);
  };



  return (
    <div className="routes-page">
      {/* <h2>Routes Management</h2> */}
      {/* Add new route form */}
      <div className="routes-form">
      <h3>{editingRoute ? "Edit Route" : "Add New Route"}</h3>
      <form onSubmit={handleAdd}>
        <input
          type="text"
          name="from"
          placeholder="From"
          value={formData.from}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="to"
          placeholder="To"
          value={formData.to}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="time"
          placeholder="Time (e.g. 5h)"
          value={formData.time}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />
        {editingRoute ? (
            <div>
              <button type="button" onClick={handleSave}>
                💾 Save
              </button>
              <button type="button" onClick={() => setEditingRoute(null)}>
                ❌ Cancel
              </button>
            </div>
          ) : (
            <button type="submit">➕ Add Route</button>
          )}
        </form>
      </div>
      <div className="routes-table-wrapper">
      <h3>All Routes</h3>
      <table className="routes-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Price</th>
            <th>Time</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) =>
            editingRoute === route.id ? (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td><input value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })} /></td>
                <td><input value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })} /></td>
                <td><input value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></td>
                <td><input value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} /></td>
                <td><input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} /></td>
                <td>
                  <button onClick={handleSave}>💾 Save</button>
                  <button onClick={() => setEditingRoute(null)}>❌ Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={route.id}>
                <td>{route.id}</td>
                <td>{route.from}</td>
                <td>{route.to}</td>
                <td>₹{route.price}</td>
                <td>{route.time}</td>
                <td><img src={route.image} alt="route" className="route-img" /></td>
                <td>
                  <button onClick={() => handleEdit(route)}>✏️ Edit</button>
                  <button onClick={() => handleDelete(route.id)}>🗑 Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default AdminRoutesPage;
