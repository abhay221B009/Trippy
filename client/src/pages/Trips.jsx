import React from "react";

const Trips = ({ trips }) => {
  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6 text-center">My Trips</h2>

      {trips.length === 0 ? (
        <p className="text-center text-gray-500">No trips saved yet...</p>
      ) : (
        <div className="space-y-4">
          {trips.map((trip, index) => (
            <div key={index} className="p-4 bg-white shadow rounded-lg">
              <p>{trip.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trips;
