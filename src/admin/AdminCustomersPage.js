import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import "./AdminCustomersPage.css";
import { useNavigate } from "react-router-dom"; 

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // Fetch customers from backend
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/customers`);
      setCustomers(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    setFiltered(
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(value) ||
          c.email.toLowerCase().includes(value)
      )
    );
  };

  // Download as CSV
  const handleDownloadCSV = () => {
    if (filtered.length === 0) return alert("No data to export!");

    const headers = ["ID", "Full Name", "Email", "Phone", "Joined On"];
    const rows = filtered.map((c) => [
      c.id,
      c.name,
      c.email,
      c.phone,
      c.joinedDate || "N/A",
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (loading) return <p className="loading">Loading customers...</p>;

  return (
    <div className="customers-page">
      <h2>Registered Customers</h2>
      {/* Search Bar */}
      <div className="customers-actions">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
        />
        <button onClick={handleDownloadCSV} className="download-btn">
          ⬇ Download CSV
        </button>
      </div>
    
      {filtered.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <table className="customers-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.joinedDate || "N/A"}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() => navigate(`/admin/customers/${c.id}`)}
                  >
                    📄 Details
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

export default AdminCustomersPage;
