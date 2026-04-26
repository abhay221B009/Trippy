import React, { useState } from "react";
import Trips from "../pages/Trips";

const TripForm = ({ setTrips }) => {
  const [formData, setFormData] = useState({
    budget: "",
    interests: "",
    days: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

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
      setResult(data.message);
      setTrips((prev) => [...prev, data]);
    } catch (error) {
      console.error(error);
      setResult("Something went wrong ❌");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Plan Your Trip ✈️
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            name="budget"
            placeholder="Budget (₹)"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="text"
            name="interests"
            placeholder="Interests (beach, food, adventure...)"
            value={formData.interests}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="number"
            name="days"
            placeholder="Days"
            value={formData.days}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
          >
            {loading ? "Generating..." : "Generate Trip 🚀"}
          </button>
        </form>

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 border rounded-lg text-center">
            <p className="text-gray-700">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripForm;
