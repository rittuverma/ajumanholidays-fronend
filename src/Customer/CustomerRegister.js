import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";
import { Link } from "react-router-dom";
import "./CustomerRegister.css";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        localStorage.setItem("customer", JSON.stringify(data.customer));
        localStorage.setItem("token", "customerToken123"); // fake token
        navigate("/customer-dashboard");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleRegister}>
          <label>Full Name</label>
          <input type="text" placeholder="Enter your full name" value={name}
            onChange={(e) => setName(e.target.value)} required />

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" placeholder="Create a password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />

          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm your password" required />

          <button type="submit" disabled={loading}>{loading ? "Registering..." : "Register"}</button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}
