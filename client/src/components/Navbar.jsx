import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm px-6 md:px-12 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
        Trippy
      </Link>
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-gray-600 hover:text-blue-600 font-semibold transition">
          Home
        </Link>

        {token ? (
          <>
            <Link to="/trips" className="text-gray-600 hover:text-blue-600 font-semibold transition">
              My Trips
            </Link>
            <button
              onClick={logout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition active:scale-95"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/signin"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="md:hidden text-gray-600 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t md:hidden flex flex-col p-6 space-y-4 animate-in slide-in-from-top duration-300">
          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-600 font-semibold py-2"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          {token ? (
            <>
              <Link 
                to="/trips" 
                className="text-gray-600 hover:text-blue-600 font-semibold py-2"
                onClick={() => setIsOpen(false)}
              >
                My Trips
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="bg-red-50 text-red-600 px-4 py-3 rounded-lg font-bold text-left transition active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/signin"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-center shadow-lg shadow-blue-200 transition active:scale-95"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
