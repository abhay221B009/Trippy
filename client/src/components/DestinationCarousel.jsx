import React, { useRef } from "react";

const destinations = [
  { name: "Goa", image: "/images/Goa.jpg", type: "beach" },
  { name: "Manali", image: "/images/Manali.jpg", type: "mountain" },
  { name: "Jaipur", image: "/images/Jaipur.jpg", type: "heritage" },
  { name: "Kerala", image: "/images/Kerala.jpg", type: "nature" },
  { name: "Ladakh", image: "/images/Ladakh.jpg", type: "adventure" },
  { name: "Udaipur", image: "/images/Udaipur.jpg", type: "luxury" },
  { name: "Rishikesh", image: "/images/Rishikesh.jpg", type: "spiritual" },
  { name: "Andaman", image: "/images/Andaman.jpg", type: "beach" },
];

const DestinationCarousel = ({ onSelect }) => {
  const scrollRef = useRef(null);

  return (
    <div className="bg-gradient-to-b from-blue-500 to-gray-100 pt-16 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Popular Destinations 🌍
        </h2>

        <p className="text-center text-indigo-100 mb-8 text-sm">
          Swipe to explore →
        </p>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory"
        >
          {destinations.map((place, index) => (
            <div
              key={index}
              onClick={() => onSelect && onSelect(place)}
              className="min-w-[250px] snap-center rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer"
            >
              <div className="relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-40 object-cover"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                <h3 className="absolute bottom-2 left-3 text-white font-semibold">
                  {place.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DestinationCarousel;
