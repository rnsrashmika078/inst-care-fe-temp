import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function JobSummaryTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const techId = localStorage.getItem("technician_id");
        if (!techId) {
          console.error("Technician ID not found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/user/service-request/${techId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch job summaries");
        }

        const data = await response.json();

        // Transform data to match the table structure: [Instrument, Owner, Start Date, End Date, Status]
        const transformedData = data.map((job) => [
          job.instrument_name,
          job.full_name,
          job.created_at, // Assuming this is the start date
          job.updated_at, // Assuming this is the end date (or you can adjust)
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
          <button className="bg-orange-600 text-white px-4 py-1 rounded-md text-sm hover:bg-orange-400">
            View all
          </button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 italic p-4 text-center">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No job summaries found.
          </p>
        ) : (
          <div className="max-h-[188px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Instrument</th>
                  <th className="p-2">Owner</th>
                  <th className="p-2">Start Date</th>
                  <th className="p-2">End Date</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((row, i) => (
                  <tr key={i} className="border-b">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`p-2 ${
                          cell === "Pass"
                            ? "text-green-500 font-bold"
                            : cell === "Rejected"
                            ? "text-red-500 font-bold"
                            : cell === "Pending"
                            ? "text-yellow-500 font-bold"
                            : cell === "In Progress"
                            ? "text-blue-500 font-bold"
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
