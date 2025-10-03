import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { API_URL } from "../config";
import { CustomerContext } from "../Context/CustomerContext";
import { FaUserCircle } from "react-icons/fa";
import "../Customer/CustomerDashboard.css";

export default function CustomerHeader() {
  const navigate = useNavigate();

  // ✅ Proper state destructuring
  const [unreadCount, setUnreadCount] = useState(0);
  // const [notifications, setNotifications] = useState([]);

  // Context & other UI state
  const { customer, setCustomer } = useContext(CustomerContext) || {};
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  // Fetch logged-in customer from localStorage if context missing
  useEffect(() => {
    if (!customer) {
      try {
        const saved = JSON.parse(localStorage.getItem("customer"));
        if (saved && setCustomer) setCustomer(saved);
      } catch (err) {
        // ignore JSON errors
      }
    }
  }, [customer, setCustomer]);

  // Fetch notifications count (include setters in deps to satisfy linter)
  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_URL}/notifications`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        // setNotifications(data || []);
        const unread = Array.isArray(data)
        ? data.filter((n) => !n.isRead).length
        : 0;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();

    // Auto-refresh every 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [setUnreadCount]);

  // Logout
  const handleLogout = () => {
    if (setCustomer) setCustomer(null);
    try {
      localStorage.removeItem("customer");
    } catch (err) {
      // ignore
    }
    navigate("/login");
  };

  // keyboard toggle helper
  const handleKeyToggle = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setDropdownOpen((v) => !v);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="top-header">
        <div>
          📧{" "}
          <a
            href="mailto:ajumanholidays@gmail.com"
            style={{ textDecoration: "none", color: "#f7f2f2ff" }}
          >
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
                onClick={() => setDropdownOpen((v) => !v)}
                onKeyDown={handleKeyToggle}
                type="button"
              >
                <FaUserCircle size={20} className="profile-icon" />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>

              {dropdownOpen && (
                <div className="profile-dropdown-menu" role="menu" aria-label="Profile menu">
                  <div className="pd-header">
                    <FaUserCircle size={36} className="pd-avatar" />
                    <div className="pd-name">{customer.name}</div>
                  </div>

                  <div className="pd-links">
                    <Link to="/customer-profile" onClick={() => setDropdownOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/customer/manage-booking" onClick={() => setDropdownOpen(false)}>
                      My Bookings
                    </Link>
                  </div>

                  <div className="pd-divider" />

                  <button
                    className="pd-logout"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="profile-guest">
              <Link to="/login">
                <button className="profile-guest-btn">Login</button>
              </Link>
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
