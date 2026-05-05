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

  useEffect(() => {
    fetch(`${API_URL}/trips`)
      .then((res) => res.json())
      .then((data) => setTrips(data))
      .catch((err) => console.error(err));
  }, [API_URL]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home setTrips={setTrips} />} />
        <Route path="/trips/:id" element={<TripDetails trips={trips} />} />
        <Route
          path="/trips"
          element={<Trips trips={trips} setTrips={setTrips} />}
        />
      </Routes>
    </>
  );
};

export default App;
