import React from "react";
import TripForm from "../components/TripForm";

const Home = ({ setTrips }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center pt-10">Trippy</h1>

      <TripForm setTrips={setTrips} />
    </div>
  );
};

export default Home;
