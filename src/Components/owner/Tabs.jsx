import React from "react";
import { NavLink, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Tabs() {
  const { id } = useParams(); // ✅ get technician id directly from URL

  const tabs = [
    { label: <ArrowLeft className="w-5 h-5" />, path: "/user/dashboard" },
    { label: "Profile", path: `/user/view-profile/${id}` },
    { label: "Request a Service", path: `/user/service-request/${id}` },
    { label: "My Request History", path: `/user/service-history/${id}` }, // you can adjust this route if needed
  ];

  return (
    <div className="flex gap-6 border-b mb-4 hover:cursor-pointer">
      {tabs.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) =>
            `pb-2 transition ${
              isActive
                ? "font-bold text-black border-b-4 border-black"
                : "text-gray-600 hover:text-black"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}
