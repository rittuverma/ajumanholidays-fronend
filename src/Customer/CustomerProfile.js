import React, { useState, useEffect, useContext } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "./CustomerProfile.css";
import { FaUserCircle } from "react-icons/fa";
import { CustomerContext } from "../Context/CustomerContext";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const storedCustomer = (() => {
    try {
      return JSON.parse(localStorage.getItem("customer"));
    } catch {
      return null;
    }
  })();

  const { customer, setCustomer } = useContext(CustomerContext) || {};

  // Fixed: proper useState tuple forms
  const [selectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Defensive initial values: prefer context customer, then storedCustomer, then empty string
  const [name, setName] = useState(customer?.name ?? storedCustomer?.name ?? "");
  const [email, setEmail] = useState(customer?.email ?? storedCustomer?.email ?? "");
  const [password, setPassword] = useState(customer?.password ?? "");
  const [loading, setLoading] = useState(false);

  // Redirect if not logged in (either context or localStorage)
  useEffect(() => {
    if (!customer && !storedCustomer) {
      navigate("/login");
    }
  }, [navigate, customer, storedCustomer]);

  // Preview selected file (hook deps include setPreview to satisfy linter; it's stable anyway)
  useEffect(() => {
    if (!selectedFile) {
      setPreview(""); // clear preview when no file
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
      setPreview("");
    };
  }, [selectedFile, setPreview]);

  // File input handler (uncomment upload logic later if you want)
  // const handleFileChange = (e) => {
  //   const f = e.target.files?.[0] ?? null;
  //   setSelectedFile(f);
  // };

  // Update profile handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If you want to upload profile pic first, add upload logic here (commented in your original file).
      // Example: upload selectedFile to backend, get profilePic URL, include it in the body below.

      const res = await fetch(`${API_URL}/customers/${customer?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok && data) {
        const updatedCustomer = data.customer || data;
        if (setCustomer) setCustomer(updatedCustomer);
        try {
          localStorage.setItem("customer", JSON.stringify(updatedCustomer));
        } catch (err) {
          // ignore localStorage write errors
        }
        alert("Profile updated successfully!");
      } else {
        alert(data?.message || "Update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // If not logged in, return null (redirect effect will send user to login)
  if (!customer && !storedCustomer) return null;

  const currentCustomer = customer ?? storedCustomer ?? {};

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        <div className="profile-pic-section">
          {preview ? (
            <img src={preview} alt="Preview" className="profile-preview" />
          ) : currentCustomer.profilePic ? (
            <img src={currentCustomer.profilePic} alt="Profile" className="profile-preview" />
          ) : (
            <FaUserCircle size={80} className="avatar-icon" />
          )}

          {/* If you want to enable file selection, uncomment this input */}
          {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}
        </div>

        <form onSubmit={handleUpdate}>
          <label>Change Your Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Change Your Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Change Your Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="button-row">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Profile"}
            </button>

            <button
              type="button"
              className="back-dashboard-btn"
              onClick={() => navigate("/customer-dashboard")}
            >
              ← Back to Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
