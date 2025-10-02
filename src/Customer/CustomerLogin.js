import React, { useState } from "react";
import "./CustomerLogin.css"; // We'll style this separately
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function CustomerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("Login Response:", data);

      if (res.ok && data.success) {
        localStorage.setItem("customer", JSON.stringify(data.customer));
        localStorage.setItem("token", data.token);
        navigate("/customer-dashboard"); // redirect
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Customer Login</h2>
        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          <button type="submit">{loading ? "Logging in..." : "Login"}</button>
        </form>

        <p className="login-footer">
          Don’t have an account?{" "} <Link to="/customers">Register</Link>
        </p>

        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    </div>
  );
}