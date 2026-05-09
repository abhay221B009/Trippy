import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

const Hero = () => {
  useEffect(() => {
    gsap.from(".hero-tagline", {
      yPercent: 100,
      stagger: 0.3,
      duration: 0.3,
    })
  }, [])
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 30%, #f0fdfa 70%, #e0f2fe 100%)",
        minHeight: "92vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Background blobs — more vivid */}
      <div
        className="blob blob-blue"
        style={{ width: 500, height: 500, top: "-120px", left: "-140px", opacity: 0.45 }}
      />
      <div
        className="blob blob-teal"
        style={{ width: 380, height: 380, bottom: "-80px", right: "-80px", opacity: 0.4 }}
      />
      <div
        className="blob blob-indigo"
        style={{ width: 280, height: 280, top: "35%", right: "12%", opacity: 0.3 }}
      />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div>
            {/* Pill badge */}
            <div className="fade-up inline-flex items-center gap-2 mb-7">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  color: "#2563EB",
                  boxShadow: "0 2px 12px rgba(37,99,235,0.12)",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "#22C55E" }}
                />
                AI-Powered Travel Planning
              </div>
            </div>

            {/* Heading */}
            <h1
              className="fade-up fade-up-delay-1 font-bold leading-[1.08] mb-6"
              style={{
                fontFamily: "'Poppins', sans-serif",
                color: "#0F172A",
                fontSize: "clamp(2.6rem, 5vw, 4.5rem)",
                letterSpacing: "-0.03em",
              }}
            >
              <span className="hero-tagline inline-block overflow-hidden">Plan your perfect</span>
              <br />
              <span className="hero-tagline gradient-text inline-block overflow-hidden">trip with AI.</span>
            </h1>

            {/* Sub-text */}
            <p
              className="fade-up fade-up-delay-2 text-lg mb-10 leading-relaxed"
              style={{ color: "#475569", maxWidth: "480px" }}
            >
              Tell Trippy your destination, budget &amp; interests. Get a{" "}
              <span style={{ color: "#2563EB", fontWeight: 600 }}>
                personalised day-by-day itinerary
              </span>{" "}
              in seconds — crafted by AI, curated for you.
            </p>

            {/* CTA buttons */}
            <div className="fade-up fade-up-delay-3 flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#plan"
                id="hero-start-planning-btn"
                className="btn-primary text-center inline-flex items-center justify-center gap-2"
                style={{ fontSize: "1rem", padding: "14px 32px", borderRadius: "14px" }}
              >
                Start Planning Free
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                to="/trips"
                id="hero-my-trips-btn"
                className="btn-outline text-center inline-flex items-center justify-center gap-2"
                style={{ fontSize: "1rem", padding: "14px 32px", borderRadius: "14px" }}
              >
                View My Trips
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="fade-up flex flex-wrap items-center gap-x-6 gap-y-3">
              <TrustPill icon="⚡" text="Instant generation" color="#F59E0B" />
              <TrustPill icon="🔒" text="Free to use" color="#22C55E" />
              <TrustPill icon="🌍" text="Any destination" color="#3B82F6" />
            </div>
          </div>

          {/* Right column — floating card */}
          <div className="hidden lg:flex items-center justify-end">
            <FloatingCard />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 60 }}>
          <path d="M0 60V30C240 0 480 60 720 30C960 0 1200 60 1440 30V60H0Z" fill="#F8FAFC" />
        </svg>
      </div>
    </section>
  );
};

const TrustPill = ({ icon, text, color }) => (
  <div className="flex items-center gap-2">
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
      style={{ background: `${color}18` }}
    >
      {icon}
    </div>
    <span className="text-sm font-medium" style={{ color: "#475569" }}>{text}</span>
  </div>
);

const FloatingCard = () => (
  <div
    className="rounded-3xl p-6 fade-up fade-up-delay-2"
    style={{
      width: 320,
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.95)",
      boxShadow: "0 8px 48px rgba(37,99,235,0.12), 0 2px 12px rgba(15,23,42,0.06)",
    }}
  >
    {/* Card header */}
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#94A3B8" }}>
          AI Itinerary
        </p>
        <p className="text-base font-bold" style={{ fontFamily: "'Poppins',sans-serif", color: "#0F172A" }}>
          Goa, 3 Days
        </p>
      </div>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
        style={{ background: "#F0FDF4", color: "#15803D", border: "1px solid #BBF7D0" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        Live
      </div>
    </div>

    {/* Day items */}
    <div className="space-y-2 mb-5">
      <PreviewDay num={1} title="Arrival & Old City" cost="₹2,400" active />
      <PreviewDay num={2} title="Beaches & Spice Markets" cost="₹1,800" />
      <PreviewDay num={3} title="Adventure & Local Cuisine" cost="₹2,100" />
    </div>

    {/* Footer */}
    <div
      className="flex justify-between items-center py-3 px-4 rounded-2xl"
      style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", border: "1px solid #BBF7D0" }}
    >
      <div>
        <p className="text-xs font-medium" style={{ color: "#64748B" }}>Total Budget</p>
        <p className="text-sm font-bold" style={{ color: "#0F172A" }}>₹6,300</p>
      </div>
      <span
        className="text-xs font-bold px-3 py-1.5 rounded-full"
        style={{ background: "#22C55E", color: "#fff" }}
      >
        ✓ Optimized
      </span>
    </div>

    {/* Subtle bottom note */}
    <p className="text-center text-xs mt-4" style={{ color: "#94A3B8" }}>
      Generated in 3 seconds ✦ Powered by AI
    </p>
  </div>
);

const PreviewDay = ({ num, title, cost, active }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
    style={{
      background: active
        ? "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)"
        : "transparent",
      border: active ? "1px solid #BFDBFE" : "1px solid transparent",
    }}
  >
    <div
      className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{
        background: active
          ? "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)"
          : "#F1F5F9",
        color: active ? "#fff" : "#64748B",
      }}
    >
      {num}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold truncate" style={{ color: "#0F172A" }}>{title}</p>
      <p className="text-xs" style={{ color: "#94A3B8" }}>Day {num}</p>
    </div>
    <span className="text-xs font-bold flex-shrink-0" style={{ color: "#15803D" }}>{cost}</span>
  </div>
);

export default Hero;
