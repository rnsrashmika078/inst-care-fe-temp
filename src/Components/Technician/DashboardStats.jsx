import React, { useEffect, useState } from "react";

export default function DashboardStats({ technicianId }) {
  const [stats, setStats] = useState([
    { label: "Total Services", value: 0 },
    { label: "Pending Services", value: 0 },
    { label: "Rejected Services", value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Use technicianId from prop or fallback to localStorage
    const id = technicianId || localStorage.getItem("technician_id");

    if (!id) {
      setError("Technician ID not found");
      setLoading(false);
      return;
    }

    const fetchJobCounts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/service-request/${id}/job-counts`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job counts");
        }

        const data = await response.json();
        const jobCounts = data.job_counts || {};

        // Use total and pending from backend response
        const updatedStats = [
          { label: "Total Services", value: jobCounts["total"] || 0 },
          { label: "Pending Services", value: jobCounts["Pending"] || 0 },
          { label: "Completed Services", value: jobCounts["Completed"] || 0 },
        ];

        setStats(updatedStats);
      } catch (err) {
        console.error("Error fetching job counts:", err);
        setError("Failed to load stats. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobCounts();
  }, [technicianId]);

  if (loading) return <div className="text-center py-6">Loading stats...</div>;
  if (error) return <div className="text-center py-6 text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 font-poppins">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-orange-300 rounded-lg p-6 text-center font-bold shadow-xl"
        >
          <div className="text-3xl mb-2">{stat.value}</div>
          {stat.label}
        </div>
      ))}
    </div>
  );
}
