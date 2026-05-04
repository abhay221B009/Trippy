import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Navbar from "./components/Navbar";
import TripDetails from "./pages/TripDetails";

const App = () => {
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("trips")) || [];
    setTrips(saved);
  }, []);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home setTrips={setTrips} />} />
        <Route
          path="/trips"
          element={<Trips trips={trips} setTrips={setTrips} />}
        />
        <Route path="/trips/:id" element={<TripDetails trips={trips} />} />
      </Routes>
    </>
  );
};

export default App;
