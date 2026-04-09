import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ServiceRequestTable() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);

  const token = sessionStorage.getItem("token");

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
              Authorization: `Bearer ${token}`,
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
  }, [token]);

  const handleRowClick = (request) => {
    setSelectedRequest(request);
  };

  const closeModal = () => {
    setSelectedRequest(null);
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
      <div className="mb-2">
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
          No pending service requests found.
        </p>
      ) : (
        <div className="overflow-x-auto max-h-[288px] overflow-y-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-orange-100 sticky top-0">
              <tr>
                <th className="p-2">Request ID</th>
                <th className="p-2">Client Name</th>
                <th className="p-2">Instrument Name</th>
                <th className="p-2">Request Date</th>
                <th className="p-2">Location</th>
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
                  <td className="p-2">SR/{request.id}</td>
                  <td className="p-2">{request.full_name}</td>
                  <td className="p-2">{request.instrument_name}</td>
                  <td className="p-2">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">{request.physical_address}</td>
                  <td className="p-2 text-orange-500 font-semibold">{request.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-[#ffffff50] bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          />

          <div className="bg-white rounded-3xl shadow-2xl w-11/12 max-w-4xl p-8 z-10 transform scale-95 opacity-0 animate-scale-fade">
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

            <div className="overflow-x-auto max-h-[70vh]">
              <table className="w-full text-left text-sm border border-gray-200 rounded-xl overflow-hidden">
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Request ID</td>
                    <td className="p-3 text-gray-800 break-words">SR/{selectedRequest.id}</td>
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
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Institute Name</td>
                    <td className="p-3">{selectedRequest.institute_name}</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50">Institute Address</td>
                    <td className="p-3">{selectedRequest.institute_address}</td>
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

                </tbody>
              </table>
            </div>

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
