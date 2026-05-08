import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const TripForm = ({ setTrips, refetchTrips }) => {
  const { token, API_URL } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchTrip = async () => {
    const response = await fetch(`${API_URL}/generate-trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(formData),
    });
    if (!response.ok) throw new Error("Server error");
    return await response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const data = await fetchTrip();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to generate trip ❌");
    }
    setLoading(false);
  };

  const handleRegenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await fetchTrip();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Failed to regenerate ❌");
    }
    setLoading(false);
  };

  const handleSaveTrip = async () => {
    if (!result) return;
    if (!token) {
      alert("Please login to save your trip! 🔑");
      navigate("/signin");
      return;
    }

    let savedTrip = null;
    let savedToMongoDB = false;

    try {
      const response = await fetch(`${API_URL}/save-trip`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(result),
      });
      if (!response.ok) throw new Error("API error");
      savedTrip = await response.json();
      savedToMongoDB = true;
      console.log("✅ Trip saved to MongoDB Atlas");
    } catch (err) {
      console.error("MongoDB save failed, saving to localStorage:", err);
      savedTrip = {
        ...result,
        _id: `local_${Date.now()}`,
        id: `local_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    if (savedTrip) {
      setTrips((prevTrips) => {
        const updatedTrips = [savedTrip, ...prevTrips];
        localStorage.setItem("trips_backup", JSON.stringify(updatedTrips));
        return updatedTrips;
      });
// Refetch trips to keep App.jsx trips state in sync
if (refetchTrips) {
  refetchTrips();
}

alert(
  savedToMongoDB
    ? "Trip saved💾"
    : "Trip saved locally 💾"
);
    }
  };

  return (
    <section
      id="plan"
      style={{ background: "linear-gradient(180deg, #F8FAFC 0%, #EEF4FF 60%, #F0FDFA 100%)" }}
      className="py-16 px-4 md:px-10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
            style={{ background: "#F0FDFA", color: "#0F766E", border: "1px solid #99F6E4" }}
          >
            ✦ AI Trip Planner
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}
          >
            Tell us your travel vision
          </h2>
          <p className="text-base" style={{ color: "#64748B", maxWidth: 440, margin: "0 auto", lineHeight: 1.7 }}>
            Our AI crafts a detailed day-by-day itinerary tailored to your budget &amp; interests.
          </p>
        </div>

        {/* Form card */}
        <div
          className="rounded-3xl p-7 md:p-9 mb-4"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid rgba(226,232,240,0.8)",
            boxShadow: "0 4px 32px rgba(37,99,235,0.08), 0 1px 8px rgba(15,23,42,0.04)",
          }}
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            id="trip-planner-form"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Destination"
                icon="🌍"
                name="destination"
                type="text"
                placeholder="e.g. Goa, Manali, Kerala..."
                value={formData.destination || ""}
                onChange={handleChange}
                id="input-destination"
              />
              <FormField
                label="Interests"
                icon="✨"
                name="interests"
                type="text"
                placeholder="e.g. adventure, food, culture..."
                value={formData.interests || ""}
                onChange={handleChange}
                id="input-interests"
              />
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField
                label="Budget"
                icon="₹"
                name="budget"
                type="number"
                placeholder="e.g. 15000"
                value={formData.budget || ""}
                onChange={handleChange}
                id="input-budget"
                iconStyle={{ fontWeight: 700, fontSize: "0.9rem", color: "#15803D" }}
              />
              <FormField
                label="Duration"
                icon="📅"
                name="days"
                type="number"
                placeholder="e.g. 5 days"
                value={formData.days || ""}
                onChange={handleChange}
                id="input-days"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-3"
              id="generate-trip-btn"
              style={{
                background: loading
                  ? "#93C5FD"
                  : "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                color: "#fff",
                padding: "16px 28px",
                fontSize: "1rem",
                border: "none",
                boxShadow: loading ? "none" : "0 6px 24px rgba(37,99,235,0.35)",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "0.01em",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block rounded-full border-2 border-white/40 border-t-white animate-spin"
                    style={{ width: 20, height: 20 }}
                  />
                  Generating your itinerary...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Generate My Trip
                </>
              )}
            </button>
          </form>
        </div>

        {/* Helper text */}
        {!result && !loading && (
          <p className="text-center text-xs" style={{ color: "#94A3B8" }}>
            No account needed to generate · Login to save trips
          </p>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-10 fade-up">
            <p className="text-sm font-medium" style={{ color: "#64748B" }}>
              AI is crafting your perfect itinerary...
            </p>
          </div>
        )}

        {/* Result */}
        {result && !loading && result.itinerary && (
          <div className="mt-12 fade-up" id="trip-result">
            {/* Result header */}
            <div className="text-center mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#94A3B8" }}>
                Your AI Itinerary
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}
              >
                Trip to <span className="gradient-text">{result.destination}</span>
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                <Chip bg="#EFF6FF" color="#1D4ED8" border="#BFDBFE">{result.days} Days</Chip>
                <Chip bg="#F0FDF4" color="#15803D" border="#BBF7D0">Budget ₹{result.budget}</Chip>
                {result.interests && (
                  <Chip bg="#F0FDFA" color="#0F766E" border="#99F6E4">{result.interests}</Chip>
                )}
              </div>
            </div>

            {/* Day cards */}
            <div className="space-y-4">
              {result.itinerary.map((day, index) => (
                <DayCard key={index} day={day} index={index} />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                id="regenerate-trip-btn"
                style={{
                  background: "#fff",
                  color: "#2563EB",
                  padding: "14px 32px",
                  fontSize: "0.9375rem",
                  border: "1.5px solid #BFDBFE",
                  boxShadow: "0 2px 8px rgba(37,99,235,0.08)",
                  cursor: "pointer",
                }}
              >
                ↺ Regenerate
              </button>
              <button
                onClick={handleSaveTrip}
                className="font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                id="save-trip-btn"
                style={{
                  background: "linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)",
                  color: "#fff",
                  padding: "14px 32px",
                  fontSize: "0.9375rem",
                  border: "none",
                  boxShadow: "0 6px 20px rgba(20,184,166,0.35)",
                  cursor: "pointer",
                }}
              >
                💾 Save This Trip
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── Sub-components ─── */

const FormField = ({ label, icon, name, type, placeholder, value, onChange, id, iconStyle }) => (
  <div>
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest mb-2"
      style={{ color: "#64748B" }}
    >
      <span style={iconStyle}>{icon}</span>
      {label}
    </label>
    <input
      id={id}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      style={{
        width: "100%",
        padding: "13px 16px",
        border: "1.5px solid #E2E8F0",
        borderRadius: "14px",
        fontSize: "0.9375rem",
        fontFamily: "'Inter', sans-serif",
        color: "#0F172A",
        background: "#FAFBFC",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
      }}
      onFocus={e => {
        e.currentTarget.style.borderColor = "#3B82F6";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.12)";
        e.currentTarget.style.background = "#fff";
      }}
      onBlur={e => {
        e.currentTarget.style.borderColor = "#E2E8F0";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "#FAFBFC";
      }}
    />
  </div>
);

const Chip = ({ children, bg, color, border }) => (
  <span
    className="text-sm font-semibold px-4 py-1.5 rounded-full"
    style={{ background: bg, color, border: `1px solid ${border}` }}
  >
    {children}
  </span>
);

const DayCard = ({ day, index }) => (
  <div
    className="rounded-2xl p-6 md:p-7 transition-all duration-300"
    id={`day-card-${index + 1}`}
    style={{
      background: "rgba(255,255,255,0.95)",
      border: "1.5px solid #F1F5F9",
      boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.10)";
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.borderColor = "#BFDBFE";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.05)";
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.borderColor = "#F1F5F9";
    }}
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
            boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
          }}
        >
          {index + 1}
        </div>
        <div>
          <h3
            className="font-bold text-base leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A" }}
          >
            {day?.day || `Day ${index + 1}`}
          </h3>
          {day?.title && (
            <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{day.title}</p>
          )}
        </div>
      </div>

      {(day?.estimated_cost || day?.estimatedCost) && (
        <span
          className="text-sm font-bold px-3 py-1.5 rounded-full flex-shrink-0"
          style={{ background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}
        >
          ₹{day?.estimated_cost || day?.estimatedCost}
        </span>
      )}
    </div>

    {/* Content grid */}
    <div className="grid md:grid-cols-3 gap-5">
      <div className="md:col-span-2">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>
          📍 Today's Plan
        </p>
        <ul className="space-y-2">
          {day?.activities?.map((activity, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm" style={{ color: "#334155" }}>
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#3B82F6" }}
              />
              {activity}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        {day?.food?.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#94A3B8" }}>
              🍽 Food
            </p>
            <ul className="space-y-1">
              {day.food.map((f, i) => (
                <li key={i} className="text-sm" style={{ color: "#475569" }}>• {f}</li>
              ))}
            </ul>
          </div>
        )}
        {day?.travel && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#94A3B8" }}>
              🚕 Getting Around
            </p>
            <p className="text-sm" style={{ color: "#475569" }}>{day.travel}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default TripForm;
