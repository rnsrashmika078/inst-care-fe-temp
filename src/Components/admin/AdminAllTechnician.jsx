import React, { useState } from "react";
import { FaEye, FaTrash, FaTimes, FaCheck } from "react-icons/fa";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import ProfileForm from "./TechnicianProfile";

export default function AllTechnicianTable({ usersData }) {
  const initialUsers = usersData || [];

  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null); // Consolidated view/edit state

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleOpenModal = (user) => setSelectedUser({ ...user });
  const handleCloseModal = () => setSelectedUser(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this technician?")) return;

    try {
      const response = await fetch(`http://localhost/instrument-care-back-end/public/admin/technicians/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        alert(result.message || "Technician deleted successfully");
      } else {
        alert(result.error || "Failed to delete technician");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while deleting the technician.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this technician as ${newStatus}?`)) return;

    try {
      const response = await fetch(`http://localhost/instrument-care-back-end/public/admin/technicians/status/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
        );
        alert(result.message || `Technician status updated to ${newStatus}`);
      } else {
        alert(result.error || "Failed to update technician status");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the status.");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      Object.values(user).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = statusFilter === "All" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="font-bold text-lg">All Technicians</h3>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md outline-none focus:border-orange-500 w-full md:w-64 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md outline-none focus:border-orange-500 text-sm bg-white min-w-[140px]"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredUsers.length === 0 ? (
          <p className="text-gray-500 italic p-8 text-center bg-white/50 rounded-lg">
            No technicians found matching your criteria.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-50/50 sticky top-0">
                  <th className="p-3 font-semibold">TechnicianID</th>
                  <th className="p-3 font-semibold">Full Name</th>
                  <th className="p-3 font-semibold">Title</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Contact</th>
                  <th className="p-3 font-semibold">Current Designation</th>
                  <th className="p-3 font-semibold">Institute/Organization</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-white/80 transition cursor-pointer">
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.id}</td>
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.full_name}</td>
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.title}</td>
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.email}</td>
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.personal_number}</td>
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.current_designation}</td>
                    <td className="p-3" onClick={() => handleOpenModal(user)}>{user.institute_name}</td>
                    <td className="p-3">
                      {user.status === "Submitted" ? (
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-1 rounded-full bg-yellow-500 text-xs font-semibold text-white mr-1">{user.status}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(user.id, "Approved"); }}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(user.id, "Declined"); }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1.5 rounded-full text-xs font-medium text-white shadow-sm block text-center ${user.status === 'Approved' ? 'bg-green-500' : user.status === 'Declined' ? 'bg-red-500' : 'bg-gray-500'}`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="p-3 flex gap-4 justify-center items-center h-full mt-1.5">
                      <FaEye
                        className="text-blue-500 hover:text-blue-700 transition transform hover:scale-110"
                        title="View / Edit Details"
                        size={18}
                        onClick={(e) => { e.stopPropagation(); handleOpenModal(user); }}
                      />
                      <FaTrash
                        className="text-red-500 hover:text-red-700 transition transform hover:scale-110"
                        title="Delete Technician"
                        size={18}
                        onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UNIFIED VIEW / EDIT MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto px-4 py-8 flex justify-center">
          <div className="bg-[#f8f9fa] rounded-2xl w-full max-w-6xl shadow-2xl relative mb-auto flex flex-col">

            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-3xl font-light z-10 transition-colors bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-sm"
              title="Close"
            >
              &times;
            </button>

            <ProfileForm userId={selectedUser.user_id} />

            <div className="bg-gray-100 rounded-b-2xl p-6 border-t border-gray-200 flex justify-end gap-4 sticky bottom-0 z-10">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition drop-shadow-sm font-medium"
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

