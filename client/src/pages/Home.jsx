import React from "react";
import TripForm from "../components/TripForm";
import Hero from "../components/Hero";
import DestinationCarousel from "../components/DestinationCarousel";

const Home = ({ setTrips, refetchTrips }) => {
  return (
    <main style={{ background: "#F8FAFC" }}>
      {/* Hero */}
      <Hero />
      {/* Destination Carousel */}
      <DestinationCarousel />
      {/* AI Trip Planner Form */}
      <TripForm setTrips={setTrips} refetchTrips={refetchTrips} />
    </main>
  );
};

export default Home;
