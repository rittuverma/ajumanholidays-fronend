import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";
import "./BusDetailsPage.css";

const BusDetailsPage = () => {
  const [buses, setBuses] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
  const fetchBuses = async () => {
    try {
      const res = await axios.get(`${API_URL}/buses`);
      setBuses(res.data);
    } catch (err) {
      console.error("Error fetching buses:", err);
    }
  };
  fetchBuses();
  }, []);

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this bus?")) return;
  try {
    await axios.delete(`${API_URL}/buses/${id}`);
    setBuses(buses.filter((bus) => bus.id !== id));
    setFiltered(filtered.filter((bus) => bus.id !== id));
    alert("Bus deleted successfully ✅");
  } catch (err) {
    console.error("Error deleting bus:", err);
    alert("Failed to delete bus ❌");
  }
};

  useEffect(() => {
    setFiltered(
      buses.filter((bus) =>
        bus.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, buses]);
  

  return (
    <div className="bus-details-page">
      <h2>Bus Details</h2>

      <div className="bus-actions">
        <input
          type="text"
          placeholder="Search bus by name or registration number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="add-bus-btn"
          onClick={() => navigate("/admin/bus-info")}
        >
          + Add New Bus
        </button>
      </div>

      {filtered.length === 0 ? (
        <p>No buses found.</p>
      ) : (
        <table className="bus-table">
          <thead>
            <tr>
              <th>Bus Name</th>
              <th>Serial No.</th>
              <th>Registration No.</th>
              <th>Type</th>
              <th>Seat Capacity</th>
              <th>Route</th>
              <th>Driver</th>
              <th>Supervisor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bus) => (
              <tr key={bus.id}>
                <td>{bus.name}</td>
                <td>{bus.serialNumber}</td>
                <td>{bus.registrationNumber}</td>
                <td>{bus.type}</td>
                <td>{bus.seatCapacity}</td>
                <td>
                  {bus.from} → {bus.to}
                </td>
                <td>{bus.driverName || "N/A"}</td>
                <td>{bus.supervisorName || "N/A"}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/admin/bus-edit/${bus.id}`)}
                  >
                    ✏ Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(bus.id)}
                  >
                  🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BusDetailsPage;
