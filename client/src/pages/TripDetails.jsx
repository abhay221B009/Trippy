import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TripDetails = ({ trips }) => {
  const { id } = useParams();
  const { token, API_URL } = useAuth();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const tripId = id;
    const localTrip = trips?.find(
      (item) => item._id === tripId || item.id === tripId
    );

    if (localTrip) setTrip(localTrip);

    const fetchTrip = async () => {
      try {
        const res = await fetch(`${API_URL}/trips/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        if (data && Object.keys(data).length > 0 && (data._id || data.id)) {
          setTrip(data);
          return;
        }
        if (localTrip) { setTrip(localTrip); return; }
        throw new Error("Trip not found");
      } catch (err) {
        console.error("TripDetails fetch error:", err);
        if (!localTrip) setError(true);
      }
    };

    if (!localTrip) fetchTrip();
  }, [id, API_URL, trips]);

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#F8FAFC" }}
      >
        <div className="glass-card rounded-3xl p-10 text-center max-w-sm w-full">
          <p className="text-4xl mb-4">😕</p>
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
          >
            Trip not found
          </h2>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            We couldn't load this itinerary. It may have been deleted.
          </p>
          <button onClick={() => navigate("/trips")} className="btn-primary w-full">
            Back to My Trips
          </button>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "#F8FAFC" }}
      >
        <div className="spinner" />
        <p className="text-sm font-medium" style={{ color: "#64748B" }}>
          Loading your itinerary...
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #EEF4FF 0%, #F8FAFC 40%, #FFFFFF 100%)" }}
    >
      <div className="max-w-4xl mx-auto px-5 md:px-10 py-16">
        {/* Back button */}
        <button
          onClick={() => navigate("/trips")}
          className="flex items-center gap-1.5 text-sm font-semibold mb-8 transition-all duration-200 hover:-translate-x-1"
          style={{ color: "#64748B" }}
          id="back-to-trips-btn"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Trips
        </button>

        {/* Header */}
        <div className="mb-10 fade-up">
          <span className="badge-blue mb-3 inline-block">AI Itinerary</span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
          >
            {trip.destination}
          </h1>
          <div className="flex flex-wrap gap-3">
            <span className="badge-blue">{trip.days} Days</span>
            <span className="badge-green">Budget ₹{trip.budget}</span>
            {trip.interests && (
              <span className="badge-teal">{trip.interests}</span>
            )}
          </div>
        </div>

        {/* Day cards */}
        <div className="space-y-5">
          {(trip.itinerary || []).map((day, index) => (
            <DetailDayCard key={index} day={day} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const DetailDayCard = ({ day, index }) => (
  <div
    className="day-card p-6 md:p-8 fade-up"
    style={{ animationDelay: `${index * 0.07}s` }}
    id={`detail-day-card-${index + 1}`}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
            color: "#fff",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {index + 1}
        </div>
        <div>
          <h2
            className="font-bold text-lg leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
          >
            {day?.day || `Day ${index + 1}`}
          </h2>
          {day?.title && (
            <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
              {day.title}
            </p>
          )}
        </div>
      </div>

      {(day?.estimated_cost || day?.estimatedCost) && (
        <span className="badge-green flex-shrink-0">
          ₹{day?.estimated_cost ?? day?.estimatedCost}
        </span>
      )}
    </div>

    {/* Grid */}
    <div className="grid md:grid-cols-3 gap-6">
      {/* Activities */}
      <div className="md:col-span-2">
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#94A3B8" }}>
          📍 Activities
        </p>
        <ul className="space-y-2">
          {day?.activities?.map((a, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm"
              style={{ color: "#334155" }}
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

      {/* Food + Travel */}
      <div className="space-y-5">
        {day?.food?.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>
              🍽 Food
            </p>
            <ul className="space-y-1">
              {day.food.map((f, i) => (
                <li key={i} className="text-sm" style={{ color: "#334155" }}>• {f}</li>
              ))}
            </ul>
          </div>
        )}

        {day?.travel && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "#94A3B8" }}>
              🚕 Getting Around
            </p>
            <p className="text-sm" style={{ color: "#334155" }}>{day.travel}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TripDetails;
