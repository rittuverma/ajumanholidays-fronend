// import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { API_URL } from "../config";
import React, { useEffect , useState } from "react";

// fetch("http://localhost:5000/routes")


const Header = () => {
const [, setRoutes] = useState([]);
  useEffect(() => {
  fetch(`${API_URL}/routes`)
    .then(res => res.json())
    .then(data => setRoutes(data))
    .catch(err => console.error("Fetch error:", err));
}, []);

  return (
    <header className="site-header">
      <h1 className="logo">AJUMAN HOLIDAYS</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/manage-bookings">ManageBooking</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
};

export default Header;