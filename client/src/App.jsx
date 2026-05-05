import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Navbar from "./components/Navbar";
import TripDetails from "./pages/TripDetails";

const App = () => {
  const [trips, setTrips] = useState([]);
  const API_URL =
    import.meta.env.VITE_API_URL || "https://trippy-backend-xiaq.onrender.com";

  // Fetch trips on mount
  useEffect(() => {
    fetchTrips();
  }, [API_URL]);

  // Refetch trips from server or localStorage
  const fetchTrips = async () => {
    try {
      const res = await fetch(`${API_URL}/trips`);
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setTrips(data || []);
      // Sync with localStorage as backup
      localStorage.setItem("trips_backup", JSON.stringify(data || []));
      console.log("✅ Trips fetched from MongoDB Atlas");
    } catch (err) {
      console.error("MongoDB fetch failed, loading from localStorage:", err);
      // Fallback to localStorage
      const localTrips = localStorage.getItem("trips_backup");
      const parsedTrips = localTrips ? JSON.parse(localTrips) : [];
      setTrips(parsedTrips);
      if (parsedTrips.length > 0) {
        console.log("✅ Trips loaded from localStorage backup");
      }
    }
  };

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home setTrips={setTrips} refetchTrips={fetchTrips} />}
        />
        <Route
          path="/trips/:id"
          element={<TripDetails trips={trips} refetchTrips={fetchTrips} />}
        />
        <Route
          path="/trips"
          element={<Trips trips={trips} setTrips={setTrips} />}
        />
      </Routes>
    </>
  );
};

export default App;
