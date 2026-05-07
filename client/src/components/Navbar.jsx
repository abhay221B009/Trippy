import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-blue-600 tracking-tighter">
        Trippy
      </Link>
      
      <div className="flex items-center space-x-8">
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
          <div className="flex items-center">
            <Link
              to="/signin"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
            >
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
