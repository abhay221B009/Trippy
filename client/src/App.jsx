import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Navbar from "./components/Navbar";

const App = () => {
  const [trips, setTrips] = useState([]);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home setTrips={setTrips} />} />
        <Route path="/trips" element={<Trips trips={trips} />} />
      </Routes>
    </>
  );
};

export default App;
