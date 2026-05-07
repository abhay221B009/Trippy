import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Trips from "./pages/Trips";
import Navbar from "./components/Navbar";
import TripDetails from "./pages/TripDetails";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const [trips, setTrips] = useState([]);
  const { token, API_URL, loading: authLoading } = useAuth();

  // Fetch trips on mount or when token changes
  useEffect(() => {
    if (token) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [token, API_URL]);

  // Refetch trips from server
  const fetchTrips = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/trips`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      setTrips(data || []);
      localStorage.setItem("trips_backup", JSON.stringify(data || []));
      console.log("✅ Trips fetched from MongoDB Atlas");
    } catch (err) {
      console.error("MongoDB fetch failed, loading from localStorage:", err);
      const localTrips = localStorage.getItem("trips_backup");
      const parsedTrips = localTrips ? JSON.parse(localTrips) : [];
      setTrips(parsedTrips);
    }
  };

  if (authLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home setTrips={setTrips} refetchTrips={fetchTrips} />}
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/trips/:id"
          element={
            token ? (
              <TripDetails trips={trips} refetchTrips={fetchTrips} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/trips"
          element={
            token ? (
              <Trips trips={trips} setTrips={setTrips} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
      <footer className="text-center text-gray-400 mt-2">
        mishty@arc &copy; {new Date().getFullYear()}
      </footer>
    </>
  );
};

export default App;
