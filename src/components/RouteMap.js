import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { API_URL } from "../config";

fetch(`${API_URL}/routes`);

const RouteMap = ({ routes }) => {
  const defaultPosition = [28.6139, 77.2090]; // Delhi (fallback center)

  return (
    <MapContainer center={defaultPosition} zoom={5} style={{ height: "400px", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {routes.map((route, index) => (
        <Marker key={index} position={[route.lat, route.lng]}>
          <Popup>
            <strong>{route.route}</strong><br />
            {route.departure} → {route.arrival}<br />
            Fare: ₹{route.fare}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default RouteMap;
