import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

export default function AdminDashboardTechnicianViewStats() {
    const [data, setData] = useState([]);
    const token = sessionStorage.getItem("token");

    useEffect(() => {
        fetchTopTechnicians();
    }, []);

    const fetchTopTechnicians = async () => {
        try {
            const res = await fetch("http://localhost/instrument-care-back-end/public/admin/technician-view-count",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching technician stats:", error);
        }
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;

            return (
                <div className="bg-white p-3 border rounded shadow text-sm">
                    <p><span className="font-semibold">Technician ID:</span> {data.id}</p>
                    <p><span className="font-semibold">Name:</span> {data.technician_name}</p>
                    <p><span className="font-semibold">Views:</span> {data.views}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 mt-5">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
                Top 10 Most Viewed Technicians
            </h3>

            <ResponsiveContainer width="100%" height={400} >
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="technician_name"
                        angle={-20}
                        textAnchor="end"
                        interval={0}
                    />

                    <YAxis />

                    <Tooltip content={<CustomTooltip />} />

                    <Bar dataKey="views" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}