import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { API_URL } from "../config";


export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/api/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log("API Response:", data);

    if (res.ok && data.success) {
      localStorage.setItem("admin", JSON.stringify(data.admin));
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } else {
      alert(data.message || "Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Error connecting to server");
  }
};


  

  const handleResetPassword = () => {
    alert("Password reset instructions sent to your email.");
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h2>{showReset ? "Reset Password" : "Admin Login"}</h2>
        <form onSubmit={showReset ? handleResetPassword : handleLogin}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {!showReset && (
            <>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </>
          )}
          <button type="submit">{showReset ? "Send Reset Link" : "Login"}</button>
        </form>
        <button
  onClick={() => navigate("/")}
  style={{
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }}
>
  Back to Home
</button>

        <p className="toggle-link" onClick={() => setShowReset(!showReset)}>
          {showReset ? "← Back to Login" : "Forgot Password?"}
        </p>
      </div>
    </div>
  );
}
