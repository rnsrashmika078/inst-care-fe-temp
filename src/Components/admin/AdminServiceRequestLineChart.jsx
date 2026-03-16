import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboardLineChart({ data }) {
  return (
    <div className="bg-[#ffffff80] p-4 rounded-lg shadow-md font-poppins">
      <h2 className="text-lg font-bold mb-4">Service Requests Overview</h2>

      <div className="w-full h-120">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="5 5" className="opacity-80" />

            {/* X-Axis (Dates) */}
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              stroke="#555"
            />

            {/* Y-Axis (Counts) */}
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#555"
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />

            {/* Line */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#f97316"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
