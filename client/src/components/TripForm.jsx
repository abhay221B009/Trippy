import React, { useState } from "react";

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
    <div className="bg-gray-100 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-10">
          Plan Your Trip ✈️
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
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
            name="days"
            placeholder="Days"
            value={formData.days}
            onChange={handleChange}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </form>

        {/* Button */}
        <div className="mt-6 text-center">
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
        </div>

        {/* Spinner */}
        {loading && (
          <div className="flex justify-center mt-4">
            <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="mt-8 p-4 bg-white border rounded-lg text-center">
            <p className="text-gray-700">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripForm;
