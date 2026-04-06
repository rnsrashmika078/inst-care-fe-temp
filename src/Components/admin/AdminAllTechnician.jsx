import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import DefaultProfileImage from "../../assets/images/profile-image.jpeg";
import ProfileForm from "./TechnicianProfile";

export default function AllTechnicianTable({ usersData }) {
  const initialUsers = usersData || [];

  const [users, setUsers] = useState(initialUsers);
  const [selectedUser, setSelectedUser] = useState(null); // Consolidated view/edit state

  const handleOpenModal = (user) => setSelectedUser({ ...user });
  const handleCloseModal = () => setSelectedUser(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!selectedUser?.id) return;

    try {
      const endpoint = `http://localhost/instrument-care-back-end/public/admin/technicians/${selectedUser.id}`;

      // Exclude attributes we shouldn't send for DB updates directly like this over PUT if unwanted
      const { id, profile_image_url, ...dataToSend } = selectedUser;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === selectedUser.id ? selectedUser : u))
        );
        handleCloseModal();
        alert(result.message || "Technician updated successfully");
      } else {
        alert(result.error || "Failed to update technician");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the technician.");
    }
  };

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

  const Input = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
      />
    </div>
  );

  const TextArea = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <textarea
        {...props}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white resize-none"
      />
    </div>
  );

  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">All Technicians</h3>
      </div>

      <div className="overflow-x-auto">
        {users.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No technicians found.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-2">TechnicianID</th>
                  <th className="p-2">Full Name</th>
                  <th className="p-2">Title</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Current Designation</th>
                  <th className="p-2">Institute/Organization</th>
                  <th className="p-2">Status</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-white/50 transition">
                    <td className="p-2 cursor-pointer" onClick={() => handleOpenModal(user)}>{user.id}</td>
                    <td className="p-2 cursor-pointer" onClick={() => handleOpenModal(user)}>{user.full_name}</td>
                    <td className="p-2">{user.title}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.personal_number}</td>
                    <td className="p-2">{user.current_designation}</td>
                    <td className="p-2">{user.institute_name}</td>
                    <td className="p-2">
                      {user.status === "Submitted" ? (
                        <div className="flex gap-2 items-center">
                          <span className="px-2 py-1 rounded bg-yellow-500 text-xs font-semibold text-white mr-1">{user.status}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(user.id, "Approved"); }}
                            className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleStatusUpdate(user.id, "Declined"); }}
                            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs text-white ${user.status === 'Approved' ? 'bg-green-500' : user.status === 'Declined' ? 'bg-red-500' : 'bg-gray-500'}`}>
                          {user.status}
                        </span>
                      )}
                    </td>
                    <td className="p-2 flex gap-4 justify-center items-center">
                      <FaEye
                        className="text-blue-600 cursor-pointer hover:text-blue-800 transition"
                        title="View / Edit Details"
                        size={18}
                        onClick={() => handleOpenModal(user)}
                      />
                      <FaTrash
                        className="text-red-600 cursor-pointer hover:text-red-800 transition"
                        title="Delete Technician"
                        size={18}
                        onClick={() => handleDelete(user.id)}
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

