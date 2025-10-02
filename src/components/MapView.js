import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { API_URL } from "../config";

fetch(`${API_URL}/routes`);

// Fix marker icons not showing
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapView({ routes, handleBookClick }) {
  const defaultCenter = [28.6139, 77.2090]; // Default to Delhi

  return (
    <div className="map-container">
      <MapContainer center={defaultCenter} zoom={6} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routes
          .filter(route => route.latitude && route.longitude)
          .map(route => (
            <Marker
              key={route.id}
              position={[route.latitude, route.longitude]}
              eventHandlers={{
                click: () => handleBookClick(route)  // ✅ Call the handler with full route info
              }}
            >
              <Popup>
  <div style={{ textAlign: "center", fontSize: "14px" }}>
    <strong>{route.from}</strong> to <strong>{route.to}</strong><br />
    <span style={{ color: "#666" }}>Fare: ₹{route.fare}</span>
    <br />
    <button
      onClick={() => handleBookClick(route)}
      style={{
    backgroundColor: "#ff5722",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    marginTop: "8px",
    fontWeight: "bold",
    transition: "background 0.3s"
  }}
    >
      Book Now
    </button>
  </div>
</Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
