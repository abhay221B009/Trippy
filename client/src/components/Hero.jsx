import React from "react";

const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-blue-700 to-blue-500 text-white py-40 px-6 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Plan Your Perfect Trip
      </h1>
      <p className="text-lg md:text mb-6 ,max-w-2xl mx-auto">
        Tell us your budget, interests and time - Trippy will generate a
        personalized travel itenary just for you.
      </p>

      <a
        href="#plan"
        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        Start Planning
      </a>
    </div>
  );
};

export default Hero;
