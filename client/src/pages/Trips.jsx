import React from "react";

const Trips = ({ trips }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">My Trips</h2>

      {trips.length === 0 ? (
        <p className="text-center text-gray-500">No trips saved yet...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {trips.map((trip, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
            >
              {/* Destination */}
              <h3 className="text-xl font-semibold mb-2">
                {trip.destination || "Trip"}
              </h3>

              {/* Meta info */}
              <p className="text-gray-500 text-sm mb-3">
                {trip.days} days • ₹{trip.budget}
              </p>

              {/* Itinerary preview */}
              <ul className="text-sm text-gray-700 space-y-1">
                {trip.itinerary?.slice(0, 2).map((item, i) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>

              {/* Button */}
              <button className="mt-4 text-blue-500 hover:underline">
                View Details →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;
