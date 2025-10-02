// import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { API_URL } from "../config";
import React, { useEffect, useRef , useState } from "react";
import { useContext } from "react";
import { CustomerContext } from "../Context/CustomerContext";
import { FaUserCircle } from "react-icons/fa";
import "../Customer/CustomerDashboard.css";


// fetch("http://localhost:5000/routes")

export default function CustomerHeader() {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  // 🔹 States
  const { customer, setCustomer } = useContext(CustomerContext);
  const [dropdownOpen, setDropdownOpen] = useState(false); // profile dropdown toggle
  const [notifications, setNotifications] = useState([]); // all notifications
  const profileRef = useRef(null);
  
    // close on outside click or Escape
  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") setDropdownOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("touchstart", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("touchstart", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);
  
  // Optional keyboard toggle helper
  const handleKeyToggle = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setDropdownOpen(v => !v);
    }
  };
  

  // 🔹 Fetch logged-in customer from localStorage (you probably save it at login)
  useEffect(() => {
    if (!customer) {
      const savedCustomer = JSON.parse(localStorage.getItem("customer"));
      if (savedCustomer) setCustomer(savedCustomer);
      }
    }, [customer, setCustomer]);

  //   loadCustomer();

  //   // 🔄 Listen for changes in localStorage (when profile is updated)
  // window.addEventListener("storage", loadCustomer);

  // return () => {
  //   window.removeEventListener("storage", loadCustomer);
  // };
  //   }, []);

// Fetch notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications`);
        const data = await res.json();
        setNotifications(data);
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // 🔄 Auto-refresh every 30 sec
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Logout function
  const handleLogout = () => {
    setCustomer(null); // clear saved customer
    localStorage.removeItem("customer");
    navigate("/login"); // go back to login page
  };

// const CustomerHeader = () => {
// const [, setRoutes] = useState([]);
//   useEffect(() => {
//   fetch(`${API_URL}/routes`)
//     .then(res => res.json())
//     .then(data => setRoutes(data))
//     .catch(err => console.error("Fetch error:", err));
// }, []);

  return (
    <div>
          {/* Top Header */}
          <div className="top-header">
            <div>
              📧{" "}
              <a href="mailto:ajumanholidays@gmail.com" style={{ textDecoration: "none", color: "#f7f2f2ff" }}>
                ajumanholidays@gmail.com
              </a>
            </div>
            <div ref={profileRef} className="fixed-profile-wrapper">
        {customer ? (
          <div className="profile-btn-wrapper">
            <button
              className="profile-btn"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
              aria-label="Open profile menu"
              onClick={() => setDropdownOpen(v => !v)}
              onKeyDown={handleKeyToggle}
              type="button"
            >
              <FaUserCircle size={20} className="profile-icon" />
            </button>
    
            {dropdownOpen && (
              <div className="profile-dropdown-menu" role="menu" aria-label="Profile menu">
                <div className="pd-header">
                  <FaUserCircle size={36} className="pd-avatar" />
                  <div className="pd-name">{customer.name}</div>
                </div>
    
                <div className="pd-links">
                  <Link to="/customer-profile" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  <Link to="/customer/manage-booking" onClick={() => setDropdownOpen(false)}>My Bookings</Link>
                </div>
    
                <div className="pd-divider" />
    
                <button className="pd-logout" onClick={() => { setDropdownOpen(false); handleLogout(); }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="profile-guest">
            {/* optional: show login/register buttons or a small fixed login icon */}
            <Link to="/login"><button className="profile-guest-btn">Login</button></Link>
          </div>
        )}
      </div>
    
          </div>
    <header>
            <div className="logo">
              <img src="/logo.jpg" alt="Ajuman Holidays Logo" />
              <span>AJUMAN HOLIDAYS</span>
            </div>
            <nav>
              <Link to="/customer-dashboard">Home</Link>
              <Link to="/customer/manage-booking">Manage My Booking</Link>
              <Link to="/customer-about">About</Link>
            </nav>
          </header>
    </div>      
  );
}


