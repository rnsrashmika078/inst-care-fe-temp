import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function JobSummaryTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const techId = sessionStorage.getItem("technician_id");
        if (!techId) {
          console.error("Technician ID not found in sessionStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/user/service-request/${techId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job summaries");
        }

        const data = await response.json();

        const transformedData = data.map((job) => [
          "SR/" + job.id,
          job.full_name,
          job.instrument_name,
          job.created_at,
          job.physical_address,
          job.status,
        ]);

        setJobs(transformedData);
      } catch (error) {
        console.error("Error fetching job summaries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Job Summary</h3>
        <Link to="/tech/all-job-summary">
          <button className="bg-orange-600 text-white px-4 py-1 rounded-md text-xs lg:text-sm hover:bg-orange-400">
            View all
          </button>
        </Link>
      </div>

      <div className="sm:hidden space-y-3 max-h-[188px] overflow-y-auto">
        {jobs.map((row, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 shadow border hover:bg-orange-50 transition"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-orange-600 text-xs lg:text-sm">{row[0]}</span>
              <span
                className={`text-xs font-semibold
            ${row[5] === "Completed" ? "text-green-500" :
                    row[5] === "Rejected" ? "text-red-500" :
                      row[5] === "Pending" ? "text-yellow-500" :
                        row[5] === "In Progress" ? "text-blue-500" : ""}
          `}
              >
                {row[5]}
              </span>
            </div>

            <div className="text-xs lg:text-sm text-gray-700">
              <p><strong>Client:</strong> {row[1]}</p>
              <p><strong>Instrument:</strong> {row[2]}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(row[3]).toLocaleDateString()}
              </p>
              <p className="truncate">
                <strong>Location:</strong> {row[4]}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* <div className="overflow-x-auto"> */}
      <div className="hidden sm:block overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 italic p-4 text-center">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No job summaries found.
          </p>
        ) : (
          <div className="max-h-[188px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              {/* <thead> */}
              <thead className="sticky top-0 bg-white">
                <tr className="border-b">
                  <th className="p-2 text-xs sm:text-sm">Request ID</th>
                  <th className="p-2 text-xs sm:text-sm">Client Name</th>
                  <th className="p-2 text-xs sm:text-sm">Instrument Name</th>
                  <th className="p-2 text-xs sm:text-sm">Request Date</th>
                  <th className="p-2 text-xs sm:text-sm">Location</th>
                  <th className="p-2 text-xs sm:text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((row, i) => (
                  <tr key={i} className="border-b">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`p-2 text-xs sm:text-sm truncate max-w-[140px] ${cell === "Pass"
                          ? "text-green-500 font-bold"
                          : cell === "Rejected"
                            ? "text-red-500 font-bold"
                            : cell === "Pending"
                              ? "text-yellow-500 font-bold"
                              : cell === "In Progress"
                                ? "text-blue-500 font-bold"
                                : cell === "Completed"
                                  ? "text-green-500 font-bold"
                                  : ""
                          }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
