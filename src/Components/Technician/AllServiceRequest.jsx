import React, { useEffect, useState } from "react";

export default function AllServiceRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const token = sessionStorage.getItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const techId = sessionStorage.getItem("technician_id");
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
              "Authorization": `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch service requests");

        const data = await response.json();
        // Handle array or { requests: [...] } format
        if (Array.isArray(data)) {
          setRequests(data);
        } else if (data && Array.isArray(data.requests)) {
          setRequests(data.requests);
        } else {
          setRequests([]);
          setError("No valid service request data found.");
        }
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

  const filteredRequests = requests.filter((request) => {
    // 1. Search filter
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      `SR/${request.id}`.toLowerCase().includes(searchStr) ||
      (request.full_name || "").toLowerCase().includes(searchStr) ||
      (request.instrument_name || "").toLowerCase().includes(searchStr) ||
      (request.physical_address || "").toLowerCase().includes(searchStr);

    // 2. Status filter
    const matchesStatus =
      statusFilter === "All" ||
      (request.status || "").toLowerCase() === statusFilter.toLowerCase();

    // 3. Date filter
    const reqDate = new Date(request.created_at);
    reqDate.setHours(0, 0, 0, 0);

    let matchesStartDate = true;
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      matchesStartDate = reqDate >= sDate;
    }

    let matchesEndDate = true;
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(0, 0, 0, 0);
      matchesEndDate = reqDate <= eDate;
    }

    return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 mb-6 font-poppins min-h-[780px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h3 className="font-bold text-lg text-gray-800 whitespace-nowrap">All Service Requests</h3>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <input
            type="text"
            placeholder="Search request..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Date Filters */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="Start Date"
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              title="End Date"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 italic text-sm">*Please click on the row if available to view more details</p>
      </div>

      {loading ? (
        <p className="text-gray-500 italic p-4 text-center">
          Loading service requests...
        </p>
      ) : error ? (
        <p className="text-red-500 italic p-4 text-center">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 italic p-4 text-center">
          No service requests found.
        </p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-gray-500 italic p-4 text-center">
          No matching service requests found based on your filters.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-[720px] overflow-y-auto w-full">
          <table className="w-full text-left text-sm border-collapse min-w-[800px]">
            <thead className="bg-orange-100 sticky top-0 z-10 w-full">
              <tr>
                <th className="p-2 min-w-[100px]">Request ID</th>
                <th className="p-2 min-w-[150px]">Client Name</th>
                <th className="p-2 min-w-[150px]">Instrument Name</th>
                <th className="p-2 min-w-[120px]">Request Date</th>
                <th className="p-2 min-w-[150px]">Location</th>
                <th className="p-2 min-w-[120px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b cursor-pointer hover:bg-orange-50 transition"
                  onClick={() => handleRowClick(request)}
                >
                  <td className="p-2">SR/{request.id}</td>
                  <td className="p-2">{request.full_name}</td>
                  <td className="p-2">{request.instrument_name}</td>
                  <td className="p-2">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">{request.physical_address}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-[#ffffff50] bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          {/* Modal content */}
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
              <table className="w-full text-left text-sm border border-gray-200 rounded-xl overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Request ID</td>
                    <td className="p-3 text-gray-800 break-words">SR/{selectedRequest.id}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black w-1/3 ">Client Details</td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Client Name</td>
                    <td className="p-3">{selectedRequest.full_name}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Email</td>
                    <td className="p-3">{selectedRequest.email}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Address</td>
                    <td className="p-3">{selectedRequest.physical_address}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Contact Number</td>
                    <td className="p-3">{selectedRequest.contact_number}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black w-1/3">Institute Details</td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Institute Name</td>
                    <td className="p-3">{selectedRequest.institute_name}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Institute Address</td>
                    <td className="p-3">{selectedRequest.institute_address}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black w-1/3">Instrument Details</td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Instrument Name</td>
                    <td className="p-3">{selectedRequest.instrument_name}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Instrument Brand</td>
                    <td className="p-3">{selectedRequest.instrument_brand}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Instrument Model</td>
                    <td className="p-3">{selectedRequest.instrument_model}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Instrument Manufacturer</td>
                    <td className="p-3">{selectedRequest.instrument_manufacturer}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Manufactured Year</td>
                    <td className="p-3">{selectedRequest.manufactured_year}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Product Testing Type</td>
                    <td className="p-3">{selectedRequest.product_testing_type}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Testing Parameter</td>
                    <td className="p-3">{selectedRequest.testing_parameter}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Consumption Period</td>
                    <td className="p-3">{selectedRequest.consumption_period}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Problem Description</td>
                    <td className="p-3">{selectedRequest.issue_description}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-black w-1/3 ">Feedback</td>
                    <td className="p-3"></td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Rate</td>
                    <td className="p-3">{selectedRequest.rate}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Review</td>
                    <td className="p-3">{selectedRequest.review}</td>
                  </tr>
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
