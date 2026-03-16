import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import profileImage from '../../assets/images/profile-image.jpeg';

export default function Admin_Sidebar() {
  const [avatarSrc, setAvatarSrc] = useState(profileImage);
  const [fullName, setFullName] = useState("System Administrator");
  const [designation, setDesignation] = useState("System Administrator");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Try to get user id (you already store this when logging in)
        const userId = localStorage.getItem("user_id");
        if (!userId) return; // nothing to fetch

        // If you store a token on login, include it (optional)
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
          // failed to fetch profile: keep defaults
          console.warn("Failed to fetch sidebar profile:", res.status);
          return;
        }

        const data = await res.json();

        // If backend returns a Cloudinary or other URL in profile_image_url, use it
        if (data.profile_image_url) {
          setAvatarSrc(data.profile_image_url);
        }

        // Update name and designation if provided
        if (data.full_name) setFullName(data.full_name);
        if (data.current_designation) setDesignation(data.current_designation);
        else if (data.company_designation) setDesignation(data.company_designation);

      } catch (err) {
        console.error("Error loading profile for sidebar:", err);
      }
    };

    loadProfile();
  }, []);

  return (
    <aside className="bg-[#ffffff80] text-black rounded-lg w-full md:w-64 flex-shrink-0 flex flex-col justify-between p-4 font-poppins">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center text-4xl mb-4">
          <img
            src={avatarSrc}
            alt="Profile"
            className="h-20 w-20 rounded-full object-cover cursor-pointer border border-gray-300 hover:scale-105 transition-transform"
          />
        </div>
        <h2 className="text-lg font-bold">{fullName}</h2>
        <p className="text-sm text-gray-800">{designation}</p>
        <hr className="w-full border-gray-700 my-4" />
        <nav className="flex flex-col items-center space-y-4 w-full">

            <Link to="/admin/dashboard">
                <button className="bg-orange-300/40 text-gray-800 hover:bg-orange-400/80 font-bold px-4 py-2 rounded-md w-48">
                    Dashboard
                </button>
            </Link>

            <Link to="/admin/technicians">
                <button className="bg-orange-300/40 text-gray-800 hover:bg-orange-400/80 font-bold px-4 py-2 rounded-md w-48">
                    Technicians
                </button>
            </Link>

            <Link to="/admin/owners">
                <button className="bg-orange-300/40 text-gray-800 hover:bg-orange-400/80 font-bold px-4 py-2 rounded-md w-48">
                    Owners
                </button>
            </Link>

            <Link to="/admin/instrument">
                <button className="bg-orange-300/40 text-gray-800 hover:bg-orange-400/80 font-bold px-4 py-2 rounded-md w-48">
                    Instruments
                </button>
            </Link>

            <Link to="/admin/service-requests">
                <button className="bg-orange-300/40 text-gray-800 hover:bg-orange-400/80 font-bold px-4 py-2 rounded-md w-48">
                    Service Requests
                </button>
            </Link>

        </nav>
      </div>

      {/* Contact Section */}
      {/* <div className="bg-orange-200 text-black rounded-lg p-4 text-sm mt-6">
        <p className="font-bold mb-2 text-center">Contact System Admin</p>
        <div className="flex items-center mb-2">
          📞 <span className="ml-2">(+94) 71 23 45 678</span>
        </div>
        <div className="flex items-center">
          ✉️ <span className="ml-2">admin@nsf.gov.lk</span>
        </div>
      </div> */}
    </aside>
  );
}
