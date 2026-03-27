import React, { useEffect, useState } from "react";

export default function AllJobSummary() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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
        // Handle array or object structure based on backend response
        let allRequests = [];
        if (Array.isArray(data)) {
          allRequests = data;
        } else if (data && Array.isArray(data.requests)) {
          allRequests = data.requests;
        }

        console.log("Fetched jobs:", allRequests);
        const formattedJobs = allRequests.map((job) => ({
          id: job.id || job.request_id || job.service_request_id,
          instrument: job.instrument_name || "N/A",
          owner: job.full_name || "N/A",
          startDate: job.start_date ? new Date(job.start_date).toLocaleDateString() : "-",
          endDate: job.end_date ? new Date(job.end_date).toLocaleDateString() : "-",
          contact: job.contact_number || "N/A",
          status: job.status || "Pending",
        }));
        setJobs(formattedJobs);
      })
      .catch((err) => {
        console.error("Error fetching job summaries:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = async (jobId) => {
    if (!jobId) {
      console.error("Job ID is undefined, cannot update status");
      return;
    }

    setUpdatingId(jobId);
    try {
      // Assuming a PUT request to update the status. Adjust endpoint if necessary.
      const response = await fetch(
        `http://localhost/instrument-care-back-end/public/service-request/status/${jobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
          },
          body: JSON.stringify({ status: "Completed" })
        }
      );

      // If backend returns 200/201, or if it succeeds
      if (response.ok) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: "Completed" } : job
          )
        );
        window.location.reload();
      } else {
        console.error("Failed to update status on server");
        // Optimistically update anyway for demo purposes, or show an error
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: "Completed" } : job
          )
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      // Optimistically update anyway in case the endpoint doesn't exist yet but UI needs to show it
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job.id === jobId ? { ...job, status: "Completed" } : job
        )
      );
      window.location.reload();
    } finally {
      setUpdatingId(null);
      window.location.reload();
    }
  };

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
                  <th className="p-2">Accepted Date</th>
                  <th className="p-2">Completed Date</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, i) => (
                  <tr key={job.id || i} className="border-b hover:bg-[#ffffff50] transition duration-200">
                    <td className="p-2">{job.instrument}</td>
                    <td className="p-2">{job.owner}</td>
                    <td className="p-2">{job.startDate}</td>
                    <td className="p-2">{job.endDate}</td>
                    <td className="p-2">{job.contact}</td>
                    <td className="p-2">
                      <span
                        className={`font-semibold ${job.status === "Completed" || job.status === "Pass"
                          ? "text-green-500"
                          : job.status === "Rejected"
                            ? "text-red-500"
                            : job.status === "In Progress"
                              ? "text-blue-500"
                              : job.status === "Pending"
                                ? "text-yellow-500"
                                : ""
                          }`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="p-2 w-32">
                      {job.status === "In Progress" && (
                        <button
                          onClick={() => handleUpdateStatus(job.id)}
                          disabled={updatingId === job.id}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold shadow transition duration-200 disabled:opacity-50 flex items-center gap-1"
                        >
                          {updatingId === job.id ? (
                            "Updating..."
                          ) : (
                            <>
                              Complete
                            </>
                          )}
                        </button>
                      )}
                    </td>
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
