// ProtectedRoute.js
import { Navigate } from "react-router-dom";
// import { API_URL } from "../config";
import { useEffect, useState } from "react";


export default function ProtectedRoute({ children }) {
  
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/auth/validate", {
      method: "GET",
      credentials: "include", // if using cookies
    })
    .then((res) => res.json())
      .then((data) => {
        setIsValid(data.success); // or whatever your API returns
      })
      .catch(() => {
        setIsValid(false);
      });
  }, []);

  if (isValid === null) return <div>Loading...</div>; // optional loader
  return isValid ? children : <Navigate to="/admin-login" />;
}
