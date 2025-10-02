import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import "../App.css";
import { API_URL } from "../config";

const Footer = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch((err) => console.error("❌ Fetch error:", err));
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Company Info */}
        <div className="footer-section">
          <h3>AJUMAN HOLIDAYS</h3>
          <p>Your trusted travel partner for safe and comfortable journeys.</p>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:info@ajumanholidays.com">info@ajumanholidays.com</a></p>
          <p>RAJVEER SINGH(RAJU) Phone: <a href="tel:+919212547773">+91 92125 49773</a></p>
          <p>RAMAN Phone: <a href="tel:+919212578546">+91 92125 78546</a></p>
          <p>Address: Ground Floor, Gali No. 8/3, Block-A, Kaushik Enclave, Burari, Delhi- 110084</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
        </div>

        {/* Social Media */}
        <div className="footer-section social-links">
          <h4>Follow Us</h4>
          <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
          <a href="https://www.instagram.com/ajuman_holidays?igsh=MWhodDVrN2JjMG95NA==" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedinIn /></a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 AJUMAN HOLIDAYS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
