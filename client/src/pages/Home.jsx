import React from "react";
import TripForm from "../components/TripForm";
import Hero from "../components/Hero";
import DestinationCarousel from "../components/DestinationCarousel";

const Home = ({ setTrips }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* HERO */}
      <Hero />
      {/*Destination carousel */}
      <DestinationCarousel />

      {/* FORM SECTION */}
      <div id="plan" className="py-10">
        <TripForm setTrips={setTrips} />
      </div>
    </div>
  );
};

export default Home;
