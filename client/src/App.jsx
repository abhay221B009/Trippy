import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const hideNavbarFooter = ["/signin", "/signup"].includes(location.pathname);

  // Fetch trips on mount or when token changes
  useEffect(() => {
    if (token) {
      fetchTrips();
    } else {
      setTrips([]);
    }
  }, [token, API_URL]);

  const fetchTrips = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/trips`, {
        headers: { Authorization: `Bearer ${token}` },
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

  if (authLoading) {
    return (
      <div
        className="h-screen flex flex-col items-center justify-center gap-3"
        style={{ background: "#F8FAFC" }}
      >
        <div className="spinner" />
        <p className="text-sm font-medium" style={{ color: "#64748B" }}>
          Loading Trippy...
        </p>
      </div>
    );
  }

  return (
    <>
      {!hideNavbarFooter && <Navbar />}

      <Routes>
        <Route path="/" element={<Home setTrips={setTrips} refetchTrips={fetchTrips} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/trips/:id"
          element={token ? <TripDetails trips={trips} refetchTrips={fetchTrips} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/trips"
          element={token ? <Trips trips={trips} setTrips={setTrips} /> : <Navigate to="/signin" />}
        />
      </Routes>

      {!hideNavbarFooter && (
        <footer
          className="text-center py-8 border-t"
          style={{ borderColor: "#F1F5F9", background: "#F8FAFC" }}
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
            >
              Trippy
            </span>
          </div>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            mishty@arc &copy; {new Date().getFullYear()} · AI-powered travel planning
          </p>
        </footer>
      )}
    </>
  );
};

export default App;
