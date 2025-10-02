// src/admin/BusInfoPage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useNavigate } from "react-router-dom";
import "./BusDetailsPage.css";

const BusInfoPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    serialNumber: "",
    registrationNumber: "",
    type: "",
    seatCapacity: 40,
    from: "",
    to: "",
    image: "",
    driverId: "",
    supervisorId: ""
  });
  const [people, setPeople] = useState([]); // drivers/supervisors source
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPeople = async () => {
      try {
        // Try employees from dashboard overview
        const ov = await axios.get(`${API_URL}/admin/dashboard-overview`);
        if (ov.data?.employees?.length) {
          setPeople(ov.data.employees);
        } else {
          // fallback to customers
          const cus = await axios.get(`${API_URL}/customers`);
          setPeople(cus.data || []);
        }
      } catch {
        const cus = await axios.get(`${API_URL}/customers`);
        setPeople(cus.data || []);
      }
    };
    loadPeople();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "seatCapacity" ? Number(value) : value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSaving(true);
    try {
      // client-side guard
      if (!form.name || !form.serialNumber || !form.registrationNumber || !form.type || !form.from || !form.to) {
        setErr("Please fill all required fields.");
        setSaving(false);
        return;
      }
      if (!Number.isFinite(form.seatCapacity) || form.seatCapacity < 1 || form.seatCapacity > 100) {
        setErr("Seat capacity must be between 1 and 100.");
        setSaving(false);
        return;
      }

      await axios.post(`${API_URL}/buses`, {
        name: form.name,
        serialNumber: form.serialNumber,
        registrationNumber: form.registrationNumber,
        type: form.type,
        seatCapacity: form.seatCapacity,
        from: form.from,
        to: form.to,
        image: form.image,
        driverId: form.driverId || null,
        supervisorId: form.supervisorId || null
      });

      navigate("/admin/bus-detail"); // go back to list
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to add bus.";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bus-info-page">
      <h2>Add New Bus</h2>
      {err && <div className="bus-error">{err}</div>}

      <form className="bus-form" onSubmit={onSubmit}>
        <div className="row">
          <label>Bus Name *</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="row">
          <label>Serial Number *</label>
          <input name="serialNumber" value={form.serialNumber} onChange={onChange} required />
        </div>
        <div className="row">
          <label>Registration Number *</label>
          <input name="registrationNumber" value={form.registrationNumber} onChange={onChange} required />
        </div>
        <div className="row">
          <label>Bus Type *</label>
          <input name="type" value={form.type} onChange={onChange} placeholder="AC / Non-AC / Sleeper ..." required />
        </div>
        <div className="row">
          <label>Seat Capacity (1–100) *</label>
          <input type="number" min="1" max="100" name="seatCapacity" value={form.seatCapacity} onChange={onChange} required />
        </div>
        <div className="row">
          <label>From *</label>
          <input name="from" value={form.from} onChange={onChange} required />
        </div>
        <div className="row">
          <label>To *</label>
          <input name="to" value={form.to} onChange={onChange} required />
        </div>
        <div className="row">
          <label>Image URL</label>
          <input name="image" value={form.image} onChange={onChange} placeholder="https://..." />
        </div>

        <div className="row">
          <label>Driver</label>
          <select name="driverId" value={form.driverId} onChange={onChange}>
            <option value="">— Select —</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>{p.name || p.fullName || p.email}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <label>Supervisor</label>
          <select name="supervisorId" value={form.supervisorId} onChange={onChange}>
            <option value="">— Select —</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>{p.name || p.fullName || p.email}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={saving}>{saving ? "Saving..." : "Add Bus"}</button>
      </form>
    </div>
  );
};

export default BusInfoPage;
