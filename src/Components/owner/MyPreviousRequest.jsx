import React, { useEffect, useState } from "react";

export default function MyPreviousRequestHistoryTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchServiceRequests = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("user_id"); // ✅ get logged-in user ID
        if (!userId) throw new Error("User not logged in");

        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/user/my-requests`,
          {
            method: "POST", // POST request to send user_id
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ user_id: userId }), // ✅ send user_id in body
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "No data found or server error");
        }

        // ✅ Support both array and object responses
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.data && Array.isArray(data.data)) {
          setJobs(data.data);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching service requests:", error);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceRequests();
  }, []); // ✅ Removed techId dependency

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Job Summary</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-[540px] overflow-y-auto">
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 italic p-4">
                    Loading...
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 italic p-4">
                    No job summaries found.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <td className="p-2">{job.instrument_name}</td>
                    <td className="p-2">{job.full_name}</td>
                    <td className="p-2">{job.created_at?.split(" ")[0]}</td>
                    <td className="p-2">{job.updated_at?.split(" ")[0]}</td>
                    <td
                      className={`p-2 font-bold ${
                        job.status === "In Progress"
                          ? "text-blue-500"
                          : job.status === "Cancelled"
                          ? "text-red-500"
                          : job.status === "Pending"
                          ? "text-yellow-500"
                          : job.status === "Completed"
                          ? "text-green-500"
                          : ""
                      }`}
                    >
                      {job.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popup Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-[#00000090] flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              Service Request #{selectedJob.id}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Full Name:</strong> {selectedJob.full_name}</p>
              <p><strong>Email:</strong> {selectedJob.email}</p>
              <p><strong>Contact:</strong> {selectedJob.contact_number}</p>
              <p><strong>Address:</strong> {selectedJob.physical_address}</p>
              <p><strong>Institute:</strong> {selectedJob.institute_name}</p>
              <p><strong>Institute Address:</strong> {selectedJob.institute_address}</p>
              <p><strong>Instrument:</strong> {selectedJob.instrument_name}</p>
              <p><strong>Brand:</strong> {selectedJob.instrument_brand}</p>
              <p><strong>Model:</strong> {selectedJob.instrument_model}</p>
              <p><strong>Manufacturer:</strong> {selectedJob.instrument_manufacturer}</p>
              <p><strong>Year:</strong> {selectedJob.manufactured_year}</p>
              <p><strong>Testing Type:</strong> {selectedJob.product_testing_type}</p>
              <p><strong>Testing Parameter:</strong> {selectedJob.testing_parameter}</p>
              <p><strong>Consumption Period:</strong> {selectedJob.consumption_period}</p>
              <p className="col-span-2"><strong>Issue:</strong> {selectedJob.issue_description}</p>
              <p className="col-span-2">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-bold ${
                    selectedJob.status === "In Progress"
                      ? "text-blue-500"
                      : selectedJob.status === "Cancelled"
                      ? "text-red-500"
                      : selectedJob.status === "Pending"
                      ? "text-yellow-500"
                      : selectedJob.status === "Completed"
                      ? "text-green-500"
                      : ""
                  }`}
                >
                  {selectedJob.status}
                </span>
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedJob(null)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
