import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ServiceRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const techId = localStorage.getItem("technician_id");
        if (!techId) {
          setError("Technician ID not found in local storage.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/user/service-request/${techId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch service requests");

        const data = await response.json();
        let allRequests = [];

        if (Array.isArray(data)) {
          allRequests = data;
        } else if (data && Array.isArray(data.requests)) {
          allRequests = data.requests;
        }

        // ✅ Filter only pending requests
        const pendingRequests = allRequests.filter(
          (r) => r.status?.toLowerCase() === "pending"
        );

        setRequests(pendingRequests);
      } catch (err) {
        console.error(err);
        setError("Failed to load service requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "in progress":
        return "bg-blue-200 text-blue-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 mb-6 font-poppins min-h-[288px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Pending Service Requests</h3>
        <Link to="/tech/all-service-request">
          <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 rounded-md text-sm hover:from-orange-400 hover:to-orange-500 transition">
            View all
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500 italic p-4 text-center">
          Loading service requests...
        </p>
      ) : error ? (
        <p className="text-red-500 italic p-4 text-center">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 italic p-4 text-center">
          No pending service requests found.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-[288px] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-orange-100 sticky top-0">
              <tr>
                <th className="p-2">Instrument</th>
                <th className="p-2">Owner</th>
                <th className="p-2">Start Date</th>
                <th className="p-2">Contact Number</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b cursor-pointer hover:bg-orange-50 transition"
                  onClick={() => handleRowClick(request)}
                >
                  <td className="p-2">{request.instrument_name}</td>
                  <td className="p-2">{request.full_name}</td>
                  <td className="p-2">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">{request.contact_number}</td>
                  <td className="p-2 text-orange-500 font-semibold">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal with Stylish Table */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background */}
          <div
            className="absolute inset-0 bg-[#ffffff50] bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-4xl p-8 z-10 transform scale-95 opacity-0 animate-scale-fade">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Service Request Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 font-bold text-3xl transition"
              >
                &times;
              </button>
            </div>

            {/* Details Table */}
            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left text-sm border-collapse">
                <tbody>
                  {Object.entries(selectedRequest).map(([key, value], idx) => {
                    if (key === "status") {
                      return (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                        >
                          <td className="p-3 font-semibold capitalize">{key}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                                value
                              )}`}
                            >
                              {value}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                    return (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                      >
                        <td className="p-3 font-semibold capitalize">{key}</td>
                        <td className="p-3">{value || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Close Button */}
            <div className="mt-6 text-right">
              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm hover:from-orange-400 hover:to-orange-500 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailwind Animation */}
      <style>
        {`
          @keyframes scale-fade {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          .animate-scale-fade {
            animation: scale-fade 0.25s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
