import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NationalLogo from "../../assets/images/national-logo.jpg";
import NsfLogo from "../../assets/images/NSF-Logo.jpg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    setIsLoggedIn(!!userId);
  }, []);

  const navLinks = ["Home", "About", "Technician", "Contact"];

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 md:py-0">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img
              src={NationalLogo}
              alt="National Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-18 md:w-18 object-contain"
            />
            <img
              src={NsfLogo}
              alt="NSF Logo"
              className="h-8 w-16 sm:h-10 sm:w-20 md:h-13 md:w-25 object-contain"
            />
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex space-x-6 lg:space-x-25">
            {navLinks.map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="text-gray-800 font-medium text-lg hover:text-orange-600 transition font-poppins"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {!isLoggedIn && (
              <>
                <Link to="/auth/login">
                  <button className="bg-orange-200 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium hover:bg-orange-100 transition font-poppins text-sm sm:text-base">
                    Log In
                  </button>
                </Link>
                <Link to="/auth/tech-registration">
                  <button className="bg-orange-400 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-medium hover:bg-orange-500 transition font-poppins text-sm sm:text-base">
                    Register as a Technician
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Hamburger icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-2 sm:space-y-4 pb-4 border-t border-gray-200 mt-2">
            {navLinks.map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="text-gray-800 font-medium text-lg hover:text-orange-600 transition font-poppins"
              >
                {link}
              </Link>
            ))}
            {!isLoggedIn && (
              <>
                <Link to="/auth/login">
                  <button className="w-full bg-orange-200 text-orange-600 px-4 py-2 rounded-md font-medium hover:bg-orange-100 transition font-poppins">
                    Log In
                  </button>
                </Link>
                <Link to="/auth/tech-registration">
                  <button className="w-full bg-orange-400 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-500 transition font-poppins">
                    Become a Technician
                  </button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
