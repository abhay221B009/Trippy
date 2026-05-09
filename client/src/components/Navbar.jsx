import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import gsap from "gsap";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-100"
          : "bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Trippy Home"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300 group-hover:scale-105">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <span
            style={{ fontFamily: "'Poppins', sans-serif" }}
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            Trippy
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/" label="Home" current={location.pathname} />
          {token && (
            <NavLink to="/trips" label="My Trips" current={location.pathname} />
          )}
        </div>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          {token ? (
            <button
              onClick={logout}
              className="text-slate-500 hover:text-red-500 font-medium text-sm px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 active:scale-95"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/signin"
                className="text-slate-600 font-semibold text-sm px-4 py-2 rounded-xl hover:bg-slate-100 transition-all duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold px-5 py-2 rounded-xl text-white transition-all duration-200 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)",
                  boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                }}
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-600 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div
          className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-5 py-5 space-y-2"
          id="mobile-menu"
        >
          <MobileNavLink to="/" label="Home" onClick={() => setIsOpen(false)} />
          {token && (
            <MobileNavLink to="/trips" label="My Trips" onClick={() => setIsOpen(false)} />
          )}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {token ? (
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full text-left text-red-500 font-semibold px-4 py-3 rounded-xl hover:bg-red-50 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="block text-slate-600 font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-white font-semibold px-4 py-3 rounded-xl transition active:scale-95"
                  style={{ background: "linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)" }}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, label, current }) => {
  const isActive = current === to;

  const onMouseEnter = () => {
    gsap.from(".active-line", {
      scaleX: 0,
      transformOrigin: "left",
      duration: 0.3,
      ease: "circ.inOut"
    })
  }

  const onMouseLeave = () => {
    gsap.killTweensOf(".active-line")
    gsap.to(".active-line", {
      scaleX: 1,
    })
  }

  return (
    <Link
      to={to}
      className={`text-sm font-semibold transition-all duration-200 relative py-1 ${
        isActive ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {label}
      {isActive && (
        <span className="active-line absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
      )}
    </Link>
  );
};

const MobileNavLink = ({ to, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-slate-600 font-semibold px-4 py-3 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
  >
    {label}
  </Link>
);

export default Navbar;
