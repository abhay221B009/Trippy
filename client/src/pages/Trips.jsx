import React from "react";
import { useNavigate } from "react-router-dom";

const Trips = ({ trips, setTrips }) => {
  const navigate = useNavigate();

  // ✅ Delete from DB
  const API_URL =
    import.meta.env.VITE_API_URL || "https://trippy-backend-xiaq.onrender.com";

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/trips/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      // Update UI
      const updatedTrips = trips.filter(
        (trip) => trip._id !== id && trip.id !== id,
      );
      setTrips(updatedTrips);

      // Update localStorage backup
      localStorage.setItem("trips_backup", JSON.stringify(updatedTrips));
      console.log("✅ Trip deleted from MongoDB & localStorage");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete ❌");
    }
  };

  if (trips.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500">No saved trips yet 😢</p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <h2 className="text-4xl font-bold text-center mb-10">✈️ My Trips</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {trips.map((trip) => {
          const tripId = trip._id || trip.id;
          return (
            <div
              key={tripId}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">{trip.destination}</h3>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(trip._id || trip.id);
                  }}
                  className="border border-red-500 p-2 rounded hover:bg-red-500 group transition flex items-center justify-center"
                >
                  <img
                    src="/delete.png"
                    alt="Delete"
                    className="w-4 h-4 group-hover:invert"
                  />
                </button>
              </div>

              {/* Meta */}
              <p className="text-gray-500 text-sm mb-3">
                {trip.days} days • ₹{trip.budget}
              </p>

              {/* Preview */}
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                {trip.itinerary?.slice(0, 1).map((day, i) => (
                  <div key={i}>
                    <p className="font-medium">{day.day}</p>
                    <ul>
                      {day.activities?.slice(0, 2).map((a, j) => (
                        <li key={j}>• {a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* View Button */}
              <button
                onClick={() => navigate(`/trips/${tripId}`)}
                className="text-blue-500 font-medium border border-blue-500 px-3 py-1 rounded hover:bg-blue-500 hover:text-white transition"
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trips;
