// src/pages/Dashboard.js
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { API_URL } from "../config";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [form, setForm] = useState({ from: "", to: "", price: "", time: "", image: "" });
  const [filters, setFilters] = useState({ search: "", price: "", time: "", sort: "" });
  const [bookings, setBookings] = useState([]);
  const [searchRoute, setSearchRoute] = useState("");
  const [filterDate, setFilterDate] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [type, setType] = useState("info");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const [showTickets, setShowTickets] = useState(false);
  const [showRefund, setShowRefund] = useState(false);

  // --- Notifications
  const sendNotification = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, type, message })
      });
      const data = await res.json();
      if (data.success) {
        setStatus("✅ Notification sent successfully!");
        setCustomerId("");
        setMessage("");
      } else {
        setStatus("❌ Failed to send notification.");
      }
    } catch (err) {
      setStatus("⚠️ Error sending notification.");
    }
  };

  // --- New booking form
  const [newBooking, setNewBooking] = useState({
    customerName: "",
    email: "",
    route: "",
    date: "",
    amount: ""
  });

  const handleAddBooking = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBooking)
    });
    if (res.ok) {
      const added = await res.json();
      setBookings(prev => [...prev, added]);
      setNewBooking({ customerName: "", email: "", route: "", date: "", amount: "" });
    }
  };

  // --- Fetch functions memoized so we can safely add them to deps
  const fetchRoutes = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/routes`);
      const data = await res.json();
      setRoutes(data || []);
    } catch (err) {
      console.error("fetchRoutes error", err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/bookings`);
      const data = await res.json();
      setBookings(data || []);
    } catch (err) {
      console.error("fetchBookings error", err);
    }
  }, []);

  // Run initial fetch on mount
  useEffect(() => {
    fetchRoutes();
    fetchBookings();
  }, [fetchRoutes, fetchBookings]);

  // Export CSV (uses filteredBookings defined below)
  const handleExportCSV = () => {
    const csv = [
      ["Customer", "Email", "Route", "Date", "Amount"],
      ...filteredBookings.map(b => [
        b.customerName,
        b.email,
        b.route,
        b.date,
        b.amount,
      ])
    ]
      .map(e => e.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bookings.csv";
    link.click();
  };

  // --- Booking filtering (uses UI state searchRoute + filterDate)
  let filteredBookings = bookings.filter((b) => {
    const q = (searchRoute || "").toLowerCase();
    const matchesQuery =
      (b.route?.toLowerCase() || "").includes(q) ||
      (b.customerName?.toLowerCase() || "").includes(q) ||
      (b.email?.toLowerCase() || "").includes(q);

    return matchesQuery;
  });

  if (filterDate) {
    filteredBookings = filteredBookings.filter(b => b.date === filterDate);
  }

  // --- Admin check & redirect (run once or when navigate changes)
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/admin");
    // if admin exists, we already call fetchRoutes in the initial mount effect
  }, [navigate]);

  // make applyFilters stable with useCallback
  const applyFilters = useCallback(() => {
    let data = [...routes];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter(route =>
        route.from.toLowerCase().includes(q) || route.to.toLowerCase().includes(q)
      );
    }

    // Price Filter
    if (filters.price) {
      const max = parseInt(filters.price);
      data = data.filter(route => parseInt(route.price) <= max);
    }

    // Time Filter
    if (filters.time) {
      const timeFilter = filters.time;
      data = data.filter(route => route.time.toLowerCase().includes(timeFilter.toLowerCase()));
    }

    // Sort
    if (filters.sort === "price_asc") {
      data.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (filters.sort === "price_desc") {
      data.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (filters.sort === "time") {
      data.sort((a, b) => a.time.localeCompare(b.time));
    }

    setFilteredRoutes(data);
  }, [filters, routes]);

  // effect that runs when filters/routes change (depends on stable applyFilters)
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/routes/${id}`, { method: "DELETE" });
    fetchRoutes();
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ from: "", to: "", price: "", time: "", image: "" });
    fetchRoutes();
  };

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/admin");
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <h3>Menu</h3>
        <ul>
          <li><Link to="/dashboard-overview">Dashboard</Link></li>
          <li><Link to="/admin-routes">Routes Management</Link></li>
          <li><Link to="/admin-customers">Customers</Link></li>
          <li
            className={`has-dropdown ${showTickets ? "open" : ""}`}
            onClick={() => setShowTickets(!showTickets)}
          >
            Tickets
            <ul className="dropdown">
              <li><Link to="/admin/allticket">All Tickets</Link></li>
              <li><Link to="/admin/cancelticket">Cancelled</Link></li>
            </ul>
          </li>
          <li><Link to="/admin/bus-detail">Bus Details</Link></li>
          <li><Link to="/admin/staff">User</Link></li>
          <li
            className={`has-dropdown ${showRefund ? "open" : ""}`}
            onClick={() => setShowRefund(!showRefund)}
          >
            Refund
            <ul className="dropdown">
              <li><Link to="/admin-dashboard#refund-request">Refund Request</Link></li>
              <li><Link to="/admin-dashboard#refunded">Refunded</Link></li>
            </ul>
          </li>
        </ul>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h2>Admin Dashboard</h2>
          <button onClick={handleLogout}>Logout</button>
        </header>

        {/* Admin Notification */}
        <div className="admin-notifications dashboard-card">
          <h2>📢 Send Notification</h2>

          <label>Customer ID:</label>
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            placeholder="Enter customer ID"
          />

          <label>Type:</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="info">ℹ️ Info</option>
            <option value="booking">✅ Booking</option>
            <option value="cancellation">❌ Cancellation</option>
            <option value="payment">💳 Payment</option>
            <option value="delay">🚌 Delay</option>
          </select>

          <label>Message:</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your notification..."
          />

          <button onClick={sendNotification}>Send Notification</button>
          {status && <p>{status}</p>}
        </div>

        {/* Add Route Form */}
        <section className="add-route-form dashboard-card">
          <h3>Add New Route</h3>
          <form onSubmit={handleAddRoute}>
            <input name="from" placeholder="From" value={form.from} onChange={handleFormChange} required />
            <input name="to" placeholder="To" value={form.to} onChange={handleFormChange} required />
            <input name="price" placeholder="Price" value={form.price} onChange={handleFormChange} required />
            <input name="time" placeholder="Time" value={form.time} onChange={handleFormChange} required />
            <input name="image" placeholder="Image URL" value={form.image} onChange={handleFormChange} />
            <button type="submit">Add Route</button>
          </form>
        </section>

        {/* 🔍 Filters */}
        <section className="filters-bar">
          <input
            type="text"
            placeholder="Search by location..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select name="price" value={filters.price} onChange={handleFilterChange}>
            <option value="">Price</option>
            <option value="500">Under ₹500</option>
            <option value="1000">Under ₹1000</option>
          </select>
          <select name="time" value={filters.time} onChange={handleFilterChange}>
            <option value="">Time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </select>
          <select name="sort" value={filters.sort} onChange={handleFilterChange}>
            <option value="">Sort</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="time">Sort by Time</option>
          </select>
        </section>

        {/* 🚌 Routes */}
        <section className="route-list dashboard-card">
          <h3>All Routes</h3>
          {filteredRoutes.length === 0 ? (
            <p>No routes found.</p>
          ) : (
            <div className="routes-grid dashboard-card">
              {filteredRoutes.map((route) => (
                <div key={route.id} className="route-card">
                  <img src={route.image} alt={`${route.from} to ${route.to}`} />
                  <h4>{route.from} → {route.to}</h4>
                  <p>₹{route.price} • {route.time}</p>
                  <div className="route-buttons">
                    <button onClick={() => handleDelete(route.id)}>Delete</button>
                    {/* Add Edit logic later */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-charts dashboard-card">
          {/* Revenue Chart */}
        </section>

        {/* Booking & Customer */}
        <section className="dashboard-customers dashboard-card">
          <h3>Customers & Bookings</h3>
          <button onClick={handleExportCSV} className="export-button">
            Export CSV
          </button>
          <div className="booking-filters">
            <input
              type="text"
              placeholder="Search by route..."
              value={searchRoute}
              onChange={(e) => setSearchRoute(e.target.value)}
            />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          <div className="customers-table dashboard-card">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Route</th>
                  <th>Date</th>
                  <th>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr><td colSpan="5">No bookings found</td></tr>
                ) : (
                  filteredBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.customerName}</td>
                      <td>{b.email}</td>
                      <td>{b.route}</td>
                      <td>{b.date}</td>
                      <td>{b.amount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="add-booking-form">
              <h4>Add Booking</h4>
              <form onSubmit={handleAddBooking}>
                <input type="text" placeholder="Customer Name" value={newBooking.customerName} onChange={(e) => setNewBooking({ ...newBooking, customerName: e.target.value })} required />
                <input type="email" placeholder="Email" value={newBooking.email} onChange={(e) => setNewBooking({ ...newBooking, email: e.target.value })} required />
                <input type="text" placeholder="Route" value={newBooking.route} onChange={(e) => setNewBooking({ ...newBooking, route: e.target.value })} required />
                <input type="date" value={newBooking.date} onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })} required />
                <input type="number" placeholder="Amount" value={newBooking.amount} onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })} required />
                <button type="submit">Add Booking</button>
              </form>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
