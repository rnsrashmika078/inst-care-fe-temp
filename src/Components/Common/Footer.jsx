import React from "react";
import { Mail } from "lucide-react"; // Email icon
import { Link } from "react-router-dom";
import NationalLogo from "../../assets/images/national-logo.png";


export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-10">
      {/* Top Row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-4 gap-6">
        {/* Left - Logo and Links */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="text-3xl font-bold flex items-center gap-1 font-poppins text-orange-500">
            <img src={NationalLogo} alt="National Logo" className="h-18 w-18" />
            Instrument Care
          </div>
          <div className="flex flex-wrap items-center gap-6 text-lg text-white font-poppins ">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <Link to="/about" className="hover:text-orange-600">About</Link>
            <Link to="/technician" className="hover:text-orange-600">Technician</Link>
            <Link to="/contact" className="hover:text-orange-600">Contact Us</Link>
          </div>
        </div>

        {/* Right - Contact */}
        <div className="flex items-center text-lg gap-2 font-poppins">
          <Mail className="w-4 h-4 text-white" />
          <span>info@nsf.gov.lk</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="max-w-7xl mx-auto mt-4 flex flex-col md:flex-row justify-between items-center text-sm text-white/70 gap-4 font-poppins">
        <p>© Copyright 2025. All Rights Reserved by National Science Foundation.</p>
        <div className="flex gap-6">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>
        </div>
      </div>
    </footer>
  );
}
