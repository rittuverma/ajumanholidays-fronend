// AdminRoutes.js
import { useEffect, useState } from "react";
import { API_URL } from "../config";

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([]);
  const [newRoute, setNewRoute] = useState({ from: "", to: "", price: "", time: "", image: "" });

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then(res => res.json())
      .then(data => setRoutes(data));
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRoute),
    });
    const added = await res.json();
    setRoutes([...routes, added]);
  };

  const handleDelete = async id => {
     await fetch(`${API_URL}/routes/${id}`, { method: "DELETE" });
    setRoutes(routes.filter(r => r.id !== id));
  };

  return (
    <section>
      <h2>Admin - Manage Routes</h2>
      <form onSubmit={handleAdd}>
        <input name="from" placeholder="From" onChange={e => setNewRoute({ ...newRoute, from: e.target.value })} />
        <input name="to" placeholder="To" onChange={e => setNewRoute({ ...newRoute, to: e.target.value })} />
        <input name="price" placeholder="Price" onChange={e => setNewRoute({ ...newRoute, price: e.target.value })} />
        <input name="time" placeholder="Time" onChange={e => setNewRoute({ ...newRoute, time: e.target.value })} />
        <input name="image" placeholder="Image URL" onChange={e => setNewRoute({ ...newRoute, image: e.target.value })} />
        <button type="submit">Add Route</button>
      </form>

      <ul>
        {routes.map(r => (
          <li key={r.id}>
            {r.from} → {r.to} - ₹{r.price}
            <button onClick={() => handleDelete(r.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}
