import React, { useEffect, useState } from "react";

export default function AdminDashboardTechnicianViewStats() {
    const [data, setData] = useState([]);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchTopTechnicians();
    }, []);

    const fetchTopTechnicians = async () => {
        try {
            const res = await fetch(
                "http://localhost/instrument-care-back-end/public/admin/technician-view-count",
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching technician stats:", error);
        }
    };

    // Get max value to scale bars
    const maxViews = Math.max(...data.map((d) => d.views), 1);

    return (
        <div className="bg-white rounded-xl shadow p-5 mt-5 font-poppins">
            <h3 className="text-lg font-bold mb-6 text-gray-800">
                Top Most Viewed Technicians
            </h3>

            <div className="space-y-4">
                {data.map((tech) => {
                    const widthPercent = (tech.views / maxViews) * 100;

                    return (
                        <div key={tech.id} className="flex flex-col gap-1">

                            {/* Name + count */}
                            <div className="flex justify-between text-sm text-gray-700">
                                <span className="font-semibold">
                                    {tech.technician_name}
                                </span>
                                <span className="text-gray-500">
                                    {tech.views} views
                                </span>
                            </div>

                            {/* Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-3 relative">
                                <div
                                    className="bg-orange-400 h-3 rounded-full transition-all duration-500"
                                    style={{ width: `${widthPercent}%` }}
                                    title={`ID: ${tech.id} | ${tech.views} views`}
                                ></div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}