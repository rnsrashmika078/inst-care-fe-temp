import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function AdminAllServiceRequest({ requestsData }) {
  const initialRequests = requestsData || [];

  const [requests, setRequests] = useState(initialRequests);
  const [editingRequest, setEditingRequest] = useState(null);
  const [viewRequest, setViewRequest] = useState(null);

  const handleEditClick = (request) => {
    setEditingRequest({ ...request });
  };

  const handleViewClick = (request) => {
    setViewRequest(request);
  };

  const handleCloseModal = () => {
    setEditingRequest(null);
    setViewRequest(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingRequest((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ CONNECTED PUT ENDPOINT
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost/instrument-care-back-end/public/admin/service-request/${editingRequest.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingRequest),
        }
      );

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        alert(result.error || "Failed to update service request");
        return;
      }

      // ✅ Update table row after success
      setRequests((prev) =>
        prev.map((req) =>
          req.id === editingRequest.id ? editingRequest : req
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Update error:", error);
      alert("Something went wrong while updating");
    }
  };

  // ✅ CONNECTED DELETE ENDPOINT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this service request?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost/instrument-care-back-end/public/admin/service-request/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        alert(result.error || "Failed to delete service request");
        return;
      }

      // ✅ Remove deleted request from table
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-orange-600";
      case "in progress":
        return "text-blue-600";
      case "cancelled":
      case "canceled":
        return "text-red-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">
          All Service Requests
        </h3>
      </div>

      <div className="overflow-x-auto">
        {requests.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No service requests found.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">Request ID</th>
                  <th className="p-3">Requester Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Instrument</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Requested On</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((req, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3">{req.id}</td>
                    <td className="p-3">{req.requesterName}</td>
                    <td className="p-3">{req.email}</td>
                    <td className="p-3">{req.instrument}</td>
                    <td
                      className={`p-3 font-semibold ${getStatusColor(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </td>
                    <td className="p-3">{req.requestedOn}</td>

                    <td className="p-3 flex gap-2 text-lg">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewClick(req)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="text-orange-600 hover:text-orange-800"
                        onClick={() => handleEditClick(req)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(req.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ====================== VIEW MODAL ====================== */}
      {viewRequest && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white w-full max-w-[95vw] max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
              <h2 className="text-xl font-semibold">
                Service Request Details
              </h2>
            </div>

            <div className="p-6 overflow-y-auto h-[calc(85vh-140px)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(viewRequest).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                >
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    {key.replace(/_/g, " ")}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-800 break-words">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== EDIT MODAL ====================== */}
      {editingRequest && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white w-full max-w-[95vw] max-h-[85vh] rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
              <h2 className="text-xl font-semibold">Edit Service Request</h2>
            </div>

            <div className="p-6 overflow-y-auto h-[calc(85vh-140px)] grid grid-cols-1 md:grid-cols-2 gap-5">
              {Object.entries(editingRequest).map(([key, value]) => {
                const isReadOnly =
                  key === "id" || key === "created_at" || key === "updated_at";

                return (
                  <label key={key} className="flex flex-col text-sm">
                    <span className="mb-1 font-medium capitalize text-gray-700">
                      {key.replace(/_/g, " ")}
                    </span>
                    <input
                      type="text"
                      name={key}
                      value={value ?? ""}
                      readOnly={isReadOnly}
                      onChange={handleChange}
                      className={`rounded-xl px-3 py-2 border ${
                        isReadOnly
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      }`}
                    />
                  </label>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
                onClick={handleCloseModal}
              >
                Cancel
              </button>

              <button
                className="px-6 py-2 rounded-full bg-orange-600 text-white hover:bg-orange-500 transition"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
