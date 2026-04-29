import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileImage from "../../assets/images/profile-image.jpeg";
import { fetchWithAuth } from "../utils/api";

export default function Sidebar() {
  const [fullName, setFullName] = useState("Untitled Technician");
  const [designation, setDesignation] = useState("Technician");
  const [image, setImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userId = sessionStorage.getItem("user_id");
        if (!userId) return;
        const token = sessionStorage.getItem("token");
        const res = await fetchWithAuth(
          `http://localhost/instrument-care-back-end/public/tech/profile/${userId}`,
          {
            method: "GET",
            headers: token
              ? { "Accept": "application/json", "Authorization": `Bearer ${token}` }
              : { "Accept": "application/json" },
          }
        );
        if (!res.ok) { console.warn("Failed to fetch sidebar profile:", res.status); return; }
        const data = await res.json();
        if (data.first_name) setFullName(data.first_name + " " + data.last_name);
        if (data.designation) setDesignation(data.designation);
        if (data.picture) setImage(data.picture);
      } catch (err) {
        console.error("Error loading profile for sidebar:", err);
      }
    };
    loadProfile();
  }, []);

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full p-4 font-poppins">
      <div className="flex flex-col items-center">
        {/* Close button — mobile only */}
        <button
          className="md:hidden self-end mb-2 text-gray-600 hover:text-gray-900 text-2xl leading-none"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center text-4xl mb-4 overflow-hidden bg-white">
          <img
            src={image ? `http://localhost/instrument-care-back-end/public/${image}` : profileImage}
            alt="Profile"
            className="h-full w-full object-cover cursor-pointer hover:scale-105 transition-transform"
          />
        </div>
        <h2 className="text-lg font-bold">{fullName}</h2>
        <p className="text-sm text-gray-800">{designation}</p>
        <hr className="w-full border-gray-700 my-4" />

        <nav className="flex flex-col items-center space-y-4 w-full">
          <Link to="/tech/dashboard" onClick={() => setIsOpen(false)}>
            <button className="bg-transparent border border-orange-200 text-orange-500 hover:bg-orange-200 hover:text-orange-700 font-semibold px-4 py-2 rounded-md w-48 transition">
              Dashboard
            </button>
          </Link>
          <Link to="/tech/service-request" onClick={() => setIsOpen(false)}>
            <button className="bg-transparent border border-orange-200 text-orange-500 hover:bg-orange-200 hover:text-orange-700 font-semibold px-4 py-2 rounded-md w-48 transition">
              Service Request
            </button>
          </Link>
          <Link to="/tech/profile" onClick={() => setIsOpen(false)}>
            <button className="bg-transparent border border-orange-200 text-orange-500 hover:bg-orange-200 hover:text-orange-700 font-semibold px-4 py-2 rounded-md w-48 transition">
              My Profile
            </button>
          </Link>
        </nav>
      </div>

      <div className="bg-orange-200 text-black rounded-lg p-4 text-sm mt-6">
        <p className="font-bold mb-2 text-center">Contact System Admin</p>
        <div className="flex items-center mb-2">
          📞 <span className="ml-2">(+94) 71 23 45 678</span>
        </div>
        <div className="flex items-center">
          ✉️ <span className="ml-2">admin@nsf.gov.lk</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Hamburger button — mobile only ── */}
      <button
        className="md:hidden fixed top-15 left-4 z-50 bg-white border border-orange-300 text-orange-500 rounded-md p-2 shadow-md"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-orange-500 mb-1"></span>
        <span className="block w-5 h-0.5 bg-orange-500 mb-1"></span>
        <span className="block w-5 h-0.5 bg-orange-500"></span>
      </button>

      {/* ── Backdrop — mobile only ── */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </div>

      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden md:flex bg-[#ffffff80] text-black rounded-lg w-64 flex-shrink-0 flex-col justify-between font-poppins">
        <SidebarContent />
      </aside>
    </>
  );
}