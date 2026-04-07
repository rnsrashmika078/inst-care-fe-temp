import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileImage from "../../assets/images/profile-image.jpeg";

export default function Sidebar() {
  const [fullName, setFullName] = useState("Untitled Technician");
  const [designation, setDesignation] = useState("Technician");
  const [image, setImage] = useState(null);

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
              : { "Accept": "application/json" },
          }
        );

        if (!res.ok) {
          console.warn("Failed to fetch sidebar profile:", res.status);
          return;
        }

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

  return (
    <aside className="bg-[#ffffff80] text-black rounded-lg w-full md:w-64 flex-shrink-0 flex flex-col justify-between p-4 font-poppins">
      <div className="flex flex-col items-center">
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

          <Link to="/tech/dashboard">
            <button className="bg-transparent border border-orange-200 text-orange-500 hover:bg-orange-200 hover:text-orange-700 font-semibold px-4 py-2 rounded-md w-48 transition">
              Dashboard
            </button>
          </Link>

          <Link to="/tech/service-request">
            <button className="bg-transparent border border-orange-200 text-orange-500 hover:bg-orange-200 hover:text-orange-700 font-semibold px-4 py-2 rounded-md w-48 transition">
              Service Request
            </button>
          </Link>

          <Link to="/tech/profile">
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
    </aside>
  );
}
