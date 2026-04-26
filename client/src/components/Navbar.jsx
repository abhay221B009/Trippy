import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Trippy</h1>
      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-500 font-medium">
          Home
        </Link>

        <Link to="/trips" className="hover:text-blue-500  font-medium">
          My Trips
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
