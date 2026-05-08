import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Trips = ({ trips, setTrips }) => {
  const navigate = useNavigate();
  const { token, API_URL } = useAuth();

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/trips/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");

      const updatedTrips = trips.filter(
        (trip) => trip._id !== id && trip.id !== id
      );
      setTrips(updatedTrips);
      localStorage.setItem("trips_backup", JSON.stringify(updatedTrips));
      console.log("✅ Trip deleted");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete ❌");
    }
  };

  if (trips.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ background: "linear-gradient(180deg, #EEF4FF 0%, #F8FAFC 100%)" }}
      >
        <div className="glass-card rounded-3xl p-12 text-center max-w-md w-full fade-up">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)" }}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="#3B82F6" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
          >
            No trips yet
          </h2>
          <p className="text-sm mb-8" style={{ color: "#64748B" }}>
            Generate and save your first AI-powered travel itinerary to see it here.
          </p>
          <button
            onClick={() => navigate("/#plan")}
            className="btn-primary w-full"
            id="trips-empty-cta-btn"
          >
            Plan a Trip →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #EEF4FF 0%, #F8FAFC 60%, #FFFFFF 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-16">
        {/* Header */}
        <div className="mb-10">
          <span className="badge-blue mb-3 inline-block">Your Collection</span>
          <h1
            className="text-4xl font-bold"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
          >
            My Trips
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#64748B" }}>
            {trips.length} saved {trips.length === 1 ? "itinerary" : "itineraries"}
          </p>
        </div>

        {/* Trip grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const tripId = trip._id || trip.id;
            return (
              <TripCard
                key={tripId}
                trip={trip}
                tripId={tripId}
                onDelete={() => handleDelete(tripId)}
                onView={() => navigate(`/trips/${tripId}`)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TripCard = ({ trip, tripId, onDelete, onView }) => (
  <div
    className="floating-card p-6 cursor-pointer group"
    onClick={onView}
    id={`trip-card-${tripId}`}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 min-w-0 pr-3">
        <h3
          className="font-bold text-lg leading-tight truncate mb-1"
          style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
        >
          {trip.destination}
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="badge-blue">{trip.days} days</span>
          <span className="badge-green">₹{trip.budget}</span>
        </div>
      </div>

      {/* Delete btn */}
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        aria-label="Delete trip"
        className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all duration-200 flex-shrink-0"
        id={`delete-trip-btn-${tripId}`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    {/* Preview snippet */}
    {trip.itinerary?.slice(0, 1).map((day, i) => (
      <div key={i} className="mb-4">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: "#94A3B8" }}
        >
          {day.day}
        </p>
        <ul className="space-y-1">
          {day.activities?.slice(0, 2).map((a, j) => (
            <li
              key={j}
              className="text-sm flex items-start gap-1.5"
              style={{ color: "#475569" }}
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#3B82F6" }}
              />
              {a}
            </li>
          ))}
        </ul>
      </div>
    ))}

    {/* Footer CTA */}
    <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: "#2563EB" }}>
      View full itinerary
      <svg
        className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
);

export default Trips;
