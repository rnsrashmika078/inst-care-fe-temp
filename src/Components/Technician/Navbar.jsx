import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import NationalLogo from "../../assets/images/national-logo.jpg";
import NsfLogo from "../../assets/images/NSF-Logo.jpg";
import profileImage from '../../assets/images/profile-image.jpeg';
import { useNavigate } from "react-router-dom";
import { doFrontendLogout } from "../auth/Logout";

export default function Navbar() {

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // State for dynamic sidebar image
  const [avatarSrc, setAvatarSrc] = useState(profileImage);

  const handleLogout = async () => {
    doFrontendLogout();
    navigate("/", { replace: true });
  };

  // Fetch profile image on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) return;

        const token = localStorage.getItem("token");

        const res = await fetch(
          `http://localhost/instrument-care-back-end/public/tech/profile/${userId}`,
          {
            method: "GET",
            headers: token
              ? {
                  "Accept": "application/json",
                  "Authorization": `Bearer ${token}`
                }
              : { "Accept": "application/json" }
          }
        );

        if (!res.ok) return;

        const data = await res.json();

        // Use Cloudinary image if exists
        if (data.profile_image_url) {
          setAvatarSrc(data.profile_image_url);
        }
      } catch (err) {
        console.error("Navbar profile fetch failed:", err);
      }
    };

    loadProfile();
  }, []);

  const navLinks = ["Home", "About", "Technician", "Contact"];

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 flex-wrap">
          
          {/* Left Logos */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={NationalLogo}
              alt="National Logo"
              className="h-12 w-auto sm:h-14"
            />
            <img
              src={NsfLogo}
              alt="NSF Logo"
              className="h-10 w-auto sm:h-12"
            />
          </div>

          {/* Center Title (Hidden on Mobile) */}
          <h1 className="hidden md:block text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight font-poppins text-center flex-1">
            Instrument Care
          </h1>

          {/* Desktop Avatar + Logout */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            
            <Link to="/tech/profile">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover cursor-pointer border border-gray-300 hover:scale-105 transition-transform"
              />
            </Link>

            <button 
              className="bg-orange-400 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-500 transition font-poppins"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex-shrink-0 flex items-center space-x-2">
            
            <Link to="/tech/profile">
              <img
                src={avatarSrc}
                alt="Profile"
                className="h-9 w-9 rounded-full object-cover cursor-pointer border border-gray-300 hover:scale-105 transition-transform"
              />
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide Menu */}
        {menuOpen && (
          <div className="md:hidden flex flex-col space-y-4 pb-4 pt-2 border-t border-gray-200">

            {navLinks.map((link) => (
              <Link
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                className="text-gray-800 font-medium text-lg hover:text-orange-600 transition font-poppins"
                onClick={() => setMenuOpen(false)}
              >
                {link}
              </Link>
            ))}

            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="w-full bg-orange-400 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-500 transition font-poppins"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
