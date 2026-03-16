import React, { useEffect, useState } from "react";

export default function AllJobSummary() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const techId = localStorage.getItem("technician_id");
    if (!techId) {
      console.error("Technician ID not found in localStorage");
      setLoading(false);
      return;
    }

    fetch(`http://localhost/instrument-care-back-end/public/user/service-request/${techId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch job summary");
        }
        return res.json();
      })
      .then((data) => {
        // Assuming your backend returns an array of job objects
        // Example shape: [{ instrument: '', owner: '', start_date: '', end_date: '', status: '' }]
        console.log(data);
        const formattedJobs = data.map((job) => [
          job.instrument_name || "N/A",
          job.full_name || "N/A",
          job.created_at || "N/A",
          job.contact_number || "N/A",
          job.status || "Pending",
        ]);
        setJobs(formattedJobs);
      })
      .catch((err) => {
        console.error("Error fetching job summaries:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">All Job Summary</h3>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <p className="text-gray-500 italic p-4 text-center">
            Loading job summaries...
          </p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No job summaries found.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
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
                            : cell === "In Progress"
                            ? "text-blue-500 font-bold"
                            : cell === "Pending"
                            ? "text-yellow-500 font-bold"
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
