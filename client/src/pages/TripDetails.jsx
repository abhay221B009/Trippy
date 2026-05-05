import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TripDetails = () => {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [error, setError] = useState(false);

  const API_URL =
    import.meta.env.VITE_API_URL || "https://trippy-backend-xiaq.onrender.com";

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const res = await fetch(`${API_URL}/trips/${id}`);

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setTrip(data);
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    fetchTrip();
  }, [id]);

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">Failed to load trip ❌</p>
    );
  }

  if (!trip) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-100 pt-16 pb-20">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h2 className="text-4xl font-bold mb-2 text-gray-900">
          ✈️ {trip.destination}
        </h2>

        <p className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium inline-block">
          {trip.days} days • Budget ₹{trip.budget}
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-5xl mx-auto space-y-6">
        {(trip.itinerary || []).map((day, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-blue-600 text-lg">
                📅 {day?.day || `Day ${index + 1}`}
              </h3>

              <span className="text-sm bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                ₹{day?.estimated_cost ?? "—"}
              </span>
            </div>

            {/* Title */}
            <p className="text-gray-600 mb-3 font-medium">{day?.title}</p>

            {/* Activities */}
            <ul className="text-sm text-gray-700 space-y-1 mb-3">
              {day?.activities?.map((a, i) => (
                <li key={i}>• {a}</li>
              ))}
            </ul>

            {/* Food + Travel */}
            <div className="text-sm text-gray-500 space-y-1">
              <p>🍽 {day?.food?.join(", ")}</p>
              <p>🚕 {day?.travel}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetails;
