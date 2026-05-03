import React, { useState } from "react";

const TripForm = ({ setTrips }) => {
  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    interests: "",
    days: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const response = await fetch("http://localhost:5000/generate-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data);
      setTrips((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="bg-gray-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Plan Your Trip ✈️
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <input
            type="text"
            name="destination"
            placeholder="Destination..."
            value={formData.destination}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="interests"
            placeholder="Interests"
            value={formData.interests}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={formData.budget}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            name="days"
            placeholder="Days"
            value={formData.days}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="col-span-full px-8 py-3 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            {loading ? "Generating..." : "Generate Trip 🚀"}
          </button>
        </form>

        {/* Button */}
        {/* <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Generating..." : "Generate Trip 🚀"}
          </button>
        </div> */}

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Result */}
        {result && !loading && result.itinerary && (
          <div className="mt-12 max-w-5xl mx-auto">
            {/* Title */}
            <h2 className="text-3xl font-bold text-center mb-10">
              ✈️ Trip to {result.destination}
            </h2>

            {/* Cards */}
            <div className="space-y-8">
              {result.itinerary.map((day, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold text-blue-600">
                      📅 {day.day}
                    </h3>

                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      ₹{day.estimated_cost || day.estimatedCost || "—"}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-gray-500 mb-4 font-medium">{day.title}</p>

                  {/* Sections */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Activities */}
                    <div>
                      <p className="font-semibold mb-2 text-gray-800">
                        🎯 Plan
                      </p>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        {day.activities.map((activity, i) => (
                          <li key={i} className="flex gap-2">
                            <span>•</span>
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Food + Travel */}
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold mb-1 text-gray-800">
                          🍽 Food
                        </p>
                        <ul className="text-sm text-gray-700">
                          {day.food.map((f, i) => (
                            <li key={i}>• {f}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold mb-1 text-gray-800">
                          🚕 Travel
                        </p>
                        <p className="text-sm text-gray-700">{day.travel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripForm;
