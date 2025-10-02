import React, { useEffect, useState } from "react";
import "./DashboardOverview.css";
import { API_URL } from "../config";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalBookings: 0,
    totalCancelled: 0,
    totalEarnings: 0,
    totalRefunds: 0,
    totalExpenses: 0,
    totalBuses: 0,
    ongoingBuses: 0,
    totalRoutes: 0,
    totalEmployees: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/dashboard-overview`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  fetchStats();
}, []);


  if (loading) return <p>Loading dashboard...</p>;

  // Prepare chart data
  const barData = [
    { name: "Bookings", value: stats.totalBookings },
    { name: "Cancelled", value: stats.totalCancelled },
    { name: "Routes", value: stats.totalRoutes },
    { name: "Customers", value: stats.totalCustomers },
  ];

  const pieData = [
    { name: "Earnings", value: stats.totalEarnings },
    { name: "Refunds", value: stats.totalRefunds },
    { name: "Expenses", value: stats.totalExpenses },
  ];
  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  return (
    <div className="dashboard-overview p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">📊 Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white shadow rounded-xl p-4 text-center">
            <h3 className="text-lg font-semibold capitalize">{key.replace(/([A-Z])/g, " $1")}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-bold mb-4">Bookings & Customers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-bold mb-4">Financial Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={120} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}