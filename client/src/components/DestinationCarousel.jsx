import React, { useRef } from "react";

const destinations = [
  { name: "Prayagraj", image: "/images/Prayagraj.jpg", type: "Ghats" },
  { name: "Goa", image: "/images/Goa.jpg", type: "Beach" },
  { name: "Varanasi", image: "/images/Varanasi.jpg", type: "Ghats" },
  { name: "Manali", image: "/images/Manali.jpg", type: "Mountain" },
  { name: "Jaipur", image: "/images/Jaipur.jpg", type: "Heritage" },
  { name: "Kerala", image: "/images/Kerala.jpg", type: "Nature" },
  { name: "Ladakh", image: "/images/Ladakh.jpg", type: "Adventure" },
  { name: "Udaipur", image: "/images/Udaipur.jpg", type: "Luxury" },
  { name: "Rishikesh", image: "/images/Rishikesh.jpg", type: "Spiritual" },
  { name: "Andaman", image: "/images/Andaman.jpg", type: "Beach" },
];

const typeConfig = {
  Beach:     { bg: "#EFF6FF", text: "#1D4ED8" },
  Ghats:     { bg: "#FFF7ED", text: "#C2410C" },
  Mountain:  { bg: "#F0FDF4", text: "#15803D" },
  Heritage:  { bg: "#FDF4FF", text: "#7C3AED" },
  Nature:    { bg: "#ECFDF5", text: "#059669" },
  Adventure: { bg: "#FFF1F2", text: "#BE123C" },
  Luxury:    { bg: "#FFFBEB", text: "#B45309" },
  Spiritual: { bg: "#EFF6FF", text: "#1D4ED8" },
};

const DestinationCarousel = ({ onSelect }) => {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-16 px-4 md:px-10"
      style={{ background: "#F8FAFC" }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-3 px-3 py-1.5 rounded-full"
              style={{ background: "#EFF6FF", color: "#2563EB", border: "1px solid #BFDBFE" }}
            >
              Popular Destinations
            </span>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#0F172A", letterSpacing: "-0.02em" }}
            >
              Where will you go next?
            </h2>
          </div>

          {/* Scroll arrows */}
          <div className="hidden md:flex gap-2 flex-shrink-0">
            <button
              onClick={() => scroll(-1)}
              aria-label="Scroll left"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 font-bold"
              style={{ border: "1.5px solid #E2E8F0", background: "#fff", color: "#64748B" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#BFDBFE"; e.currentTarget.style.color = "#2563EB"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
            >
              ←
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Scroll right"
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 font-bold"
              style={{ border: "1.5px solid #E2E8F0", background: "#fff", color: "#64748B" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#EFF6FF"; e.currentTarget.style.borderColor = "#BFDBFE"; e.currentTarget.style.color = "#2563EB"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
            >
              →
            </button>
          </div>
        </div>

        {/* Mobile swipe hint */}
        <p className="md:hidden text-xs font-semibold mb-4 uppercase tracking-widest" style={{ color: "#94A3B8" }}>
          Swipe to explore →
        </p>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory"
        >
          {destinations.map((place, index) => {
            const cfg = typeConfig[place.type] || { bg: "#F1F5F9", text: "#475569" };
            return (
              <div
                key={index}
                onClick={() => onSelect && onSelect(place)}
                className="dest-card flex-shrink-0 snap-center"
                style={{ width: 220, borderRadius: 20 }}
                id={`dest-card-${place.name.toLowerCase()}`}
              >
                <div className="relative" style={{ height: 220 }}>
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Deep gradient overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 50%, transparent 100%)",
                      borderRadius: "inherit",
                    }}
                  />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        color: cfg.text,
                        backdropFilter: "blur(8px)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {place.type}
                    </span>
                  </div>

                  {/* Name + subtle indicator */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      className="text-white font-bold text-lg leading-tight"
                      style={{ fontFamily: "'Poppins', sans-serif", textShadow: "0 1px 4px rgba(0,0,0,0.3)" }}
                    >
                      {place.name}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                      India
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DestinationCarousel;
