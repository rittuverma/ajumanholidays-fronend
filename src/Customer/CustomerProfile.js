import React, { useState, useEffect } from "react";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "./CustomerProfile.css";
import { useContext } from "react";
import { FaUserCircle } from "react-icons/fa"; 
import { CustomerContext } from "../Context/CustomerContext";

export default function CustomerProfile() {
  const navigate = useNavigate();
  const storedCustomer = JSON.parse(localStorage.getItem("customer"));
  const { customer, setCustomer } = useContext(CustomerContext);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState(customer.name || "");
  const [email, setEmail] = useState(customer.email || "");
  const [password, setPassword] = useState(customer.password || "");
  const [profilePic, setProfilePic] = useState(customer.profilePic || "");
  const [loading, setLoading] = useState(false);
  
// Redirect if not logged in


  useEffect(() => {
    if (!storedCustomer) navigate("/login");
  }, [navigate, storedCustomer]);

  // Preview selected file
  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // // Upload Profile Pic to backend
  // const handleUploadPic = async () => {
  //   if (!selectedFile) return alert("Please select a picture first!");
  //   const formData = new FormData();
  //   formData.append("profilePic", selectedFile);

  //   try {
  //     const res = await fetch(`${API_URL}/api/customers/${customer.id}/upload`, {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await res.json();
  //     if (data.success) {
  //       setProfilePic(data.profilePic);
  //       const updatedCustomer = { ...customer, profilePic: data.profilePic };
  //       setCustomer(updatedCustomer);
  //       localStorage.setItem("customer", JSON.stringify(updatedCustomer));
  //       alert("Profile picture updated!");
  //     } else {
  //       alert("Upload failed");
  //     }
  //   } catch (err) {
  //     console.error("Upload error:", err);
  //     alert("Something went wrong while uploading.");
  //   }
  // };

// Update name, email, password
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedPic = profilePic;
      // 1️⃣ If a new file was selected → upload it first
      if (selectedFile) {
        const formData = new FormData();
        formData.append("profilePic", selectedFile);

        const uploadRes = await fetch(
          `${API_URL}/api/customers/${customer.id}/upload`,
          { method: "POST", body: formData }
        );

        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          uploadedPic = uploadData.profilePic;
        } else {
          alert("Profile picture upload failed.");
        }
      }

      // 2️⃣ Update customer details
      const res = await fetch(`${API_URL}/customers/${customer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, profilePic: uploadedPic }),
      });

      const data = await res.json();
      if (res.ok && data) {
        const updatedCustomer = data.customer || data; // handle both cases

        setCustomer(updatedCustomer);

        localStorage.setItem("customer", JSON.stringify(updatedCustomer));

        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>
        <div className="profile-pic-section">
          <FaUserCircle size={80} className="avatar-icon" />
        </div>

        <form onSubmit={handleUpdate}>
          <label>Change Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Change Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Change our Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        <div className="button-row">
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Save Profile"}
          </button>
        
        {/* Back to Dashboard Button */}
        <button 
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
