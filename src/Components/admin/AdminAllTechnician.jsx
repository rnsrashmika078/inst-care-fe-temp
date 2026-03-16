import React, { useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Import icons

export default function AllTechnicianTable({ usersData }) {
  const initialUsers = usersData || [];

  const [users, setUsers] = useState(initialUsers);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

  const handleEditClick = (user) => setEditingUser({ ...user });
  const handleViewClick = (user) => setViewingUser({ ...user });
  const handleCloseModal = () => setEditingUser(null);
  const handleCloseViewModal = () => setViewingUser(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
  if (!editingUser?.id) return;

  try {
    // Prepare endpoint with technician ID
    const endpoint = `http://localhost/instrument-care-back-end/public/admin/technicians/${editingUser.id}`;

    // Prepare data to send (exclude id and profile image)
    const { id, profile_image_url, ...dataToSend } = editingUser;

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json();

    if (response.ok) {
      // ✅ Update local state
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? editingUser : u))
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
      // ✅ Call the DELETE endpoint with the technician ID
      const response = await fetch(`http://localhost/instrument-care-back-end/public/admin/technicians/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (response.ok) {
        // ✅ Remove from local state if backend deletion succeeded
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
  

  const FormBlock = ({ title, children }) => (
    <div>
      <h3 className="mb-5 text-sm font-semibold tracking-wide text-neutral-800 uppercase">
        {title}
      </h3>
      <div className="space-y-5">{children}</div>
    </div>
  );

  const Input = ({ label, ...props }) => (
    <div className="relative">
      <label className="block text-xs mb-1 text-neutral-500">{label}</label>
      <input
        {...props}
        className="w-full bg-transparent border-b border-neutral-300 focus:border-orange-500 outline-none py-1.5 transition"
      />
    </div>
  );

  const TextArea = ({ label, ...props }) => (
    <div className="relative">
      <label className="block text-xs mb-1 text-neutral-500">{label}</label>
      <textarea
        {...props}
        className="w-full bg-transparent border-b border-neutral-300 focus:border-orange-500 outline-none py-1.5 transition resize-none"
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
                  <th className="p-2">Full Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Contact</th>
                  <th className="p-2">Created At</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} className="border-b">
                    <td className="p-2">{user.full_name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.personal_number}</td>
                    <td className="p-2">{user.created_at}</td>
                    <td className="p-2 flex gap-3">
                      <FaEye
                        className="text-blue-600 cursor-pointer hover:text-blue-500"
                        size={18}
                        onClick={() => handleViewClick(user)}
                      />
                      <FaEdit
                        className="text-orange-600 cursor-pointer hover:text-orange-500"
                        size={18}
                        onClick={() => handleEditClick(user)}
                      />
                      <FaTrash
                        className="text-red-600 cursor-pointer hover:text-red-500"
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

      {/* MODERN GLASS STYLE EDIT MODAL */}
        {editingUser && (
          <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md flex justify-center items-center z-50 p-6">
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl w-full max-w-7xl h-[80vh] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] flex overflow-hidden">

              {/* LEFT PROFILE COLUMN */}
              <div className="w-full md:w-1/3 bg-gradient-to-b from-neutral-100 to-white p-10 flex flex-col items-center border-r">
                <img
                  src={editingUser.profile_image_url || "https://via.placeholder.com/150"}
                  className="w-36 h-36 rounded-full border-[5px] border-white shadow-xl object-cover mb-6"
                />

                <input
                  type="text"
                  name="full_name"
                  value={editingUser.full_name || ""}
                  onChange={handleChange}
                  className="text-2xl font-semibold text-center bg-transparent focus:outline-none border-b border-transparent focus:border-neutral-400 mb-2"
                />

                <input
                  type="text"
                  name="current_designation"
                  value={editingUser.current_designation || ""}
                  onChange={handleChange}
                  className="text-sm text-neutral-500 text-center bg-transparent focus:outline-none"
                />

                <textarea
                  name="bio"
                  value={editingUser.bio || ""}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Short bio..."
                  className="text-xs text-neutral-500 text-center bg-transparent focus:outline-none resize-none w-full mt-2"
                />

                {/* WORK INLINE */}
                <div className="w-full mt-10 flex justify-between items-center text-sm">
                  <input
                    type="text"
                    name="company_name"
                    value={editingUser.company_name || ""}
                    onChange={handleChange}
                    className="font-medium bg-transparent outline-none"
                  />

                  <div className="text-right">
                    {/* <input
                      type="text"
                      name="company_designation"
                      value={editingUser.company_designation || ""}
                      onChange={handleChange}
                      className="text-xs text-neutral-500 bg-transparent outline-none text-right block"
                    /> */}
                    <input
                      type="number"
                      name="years_of_experience"
                      value={editingUser.years_of_experience || ""}
                      onChange={handleChange}
                      className="text-xs text-neutral-500 bg-transparent outline-none text-right block"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT FORM COLUMN */}
              <div className="flex-1 px-12 py-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 overflow-y-auto">

                {/* CONTACT */}
                <FormBlock title="Contact">
                  <Input label="Email" name="email" value={editingUser.email} onChange={handleChange} />
                  <Input label="Phone" name="personal_number" value={editingUser.personal_number} onChange={handleChange} />
                  <Input label="Address" name="address" value={editingUser.address} onChange={handleChange} />
                </FormBlock>

                {/* BASIC */}
                <FormBlock title="Basic Info">
                  <Input label="NIC" name="nic" value={editingUser.nic} onChange={handleChange} />
                  <Input label="Institute" name="institute_name" value={editingUser.institute_name} onChange={handleChange} />
                  <Input label="Supervisor" name="supervisor_name" value={editingUser.supervisor_name} onChange={handleChange} />
                </FormBlock>

                {/* CERTIFICATE */}
                <FormBlock title="Certificate">
                  <Input label="Certificate Name" name="certificate_name" value={editingUser.certificate_name} onChange={handleChange} />
                  <Input label="Issued Year" name="certificate_issued_year" value={editingUser.certificate_issued_year} onChange={handleChange} />
                  <Input label="Verification Code" name="certificate_verification_code" value={editingUser.certificate_verification_code} onChange={handleChange} />
                </FormBlock>

                {/* ADDITIONAL */}
                <FormBlock title="Additional">
                  <TextArea label="Bio" name="bio" value={editingUser.bio} onChange={handleChange} />
                  <Input label="Guarantee" name="guarantee_for_service" value={editingUser.guarantee_for_service} onChange={handleChange} />
                  <TextArea label="Comment" name="additional_comment" value={editingUser.additional_comment} onChange={handleChange} />
                </FormBlock>

              </div>

              {/* FOOTER ACTIONS */}
              <div className="absolute bottom-6 right-8 flex gap-3">
                <button onClick={handleCloseModal} className="px-5 py-2 rounded-lg bg-neutral-200 hover:bg-neutral-300 transition">
                  Cancel
                </button>
                <button onClick={handleSave} className="px-6 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-500 transition shadow-lg">
                  Save Changes
                </button>
              </div>

              {/* CLOSE */}
              <button
                onClick={handleCloseModal}
                className="absolute top-5 right-6 text-2xl text-neutral-600 hover:text-black"
              >
                ×
              </button>
            </div>
          </div>
        )}




      {/* MODERN VIEW MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="relative bg-white rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Column - Profile */}
            <div className="bg-gray-50 p-8 flex flex-col items-center w-full md:w-1/3">
              <img
                src={viewingUser.profile_image_url || "https://via.placeholder.com/150"}
                alt={viewingUser.full_name}
                className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 shadow-md mb-4"
              />
              <h2 className="text-2xl font-bold text-center mb-1">{viewingUser.full_name}</h2>
              <p className="text-gray-500 text-sm text-center mb-6">{viewingUser.current_designation || "-"}</p>
              <p className="text-gray-500 text-sm text-center mb-6">{viewingUser.bio || "-"}</p>

              {/* Work Section */}
              <div className="w-full mb-6 flex justify-between items-center">
                {/* Left: Company Name */}
                <p className="text-gray-400 text-sm">Company: {viewingUser.company_name || "-"}</p>

                {/* Right: Designation & Experience */}
                <div className="text-right">
                  {/* <p className="text-gray-400 text-xs">{viewingUser.company_designation || "-"}</p> */}
                  <p className="text-gray-400 text-sm">
                    Experience: {viewingUser.years_of_experience ?? "-"} Year(s)
                  </p>
                </div>
              </div>

              {/* Skills Section */}
              {viewingUser.skills?.length > 0 && (
                <div className="w-full">
                  <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">Skills</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    {viewingUser.skills.map((skill, idx) => (
                      <li key={idx}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-auto">
              
              {/* Contact Information */}
              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 pr-0 md:pr-4">
                <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                <p><span className="font-medium">Email: </span>{viewingUser.email || "-"}</p>
                <p><span className="font-medium">Phone: </span>{viewingUser.personal_number || "-"}</p>
                <p><span className="font-medium">Address: </span>{viewingUser.address || "-"}</p>
              </div>

              {/* Basic Information */}
              <div className="pb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Basic Information</h3>
                <p><span className="font-medium">NIC: </span>{viewingUser.nic || "-"}</p>
                <p><span className="font-medium">Institute: </span>{viewingUser.institute_name || "-"}</p>
                <p><span className="font-medium">Supervisor: </span>{viewingUser.supervisor_name || "-"}</p>
              </div>

              {/* Certificate */}
              <div className="border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 pr-0 md:pr-4">
                <h3 className="font-semibold text-gray-700 mb-2">Certificate</h3>
                <p><span className="font-medium">Name: </span>{viewingUser.certificate_name || "-"}</p>
                <p><span className="font-medium">Issued: </span>{viewingUser.certificate_issued_year || "-"}</p>
                <p><span className="font-medium">Code: </span>{viewingUser.certificate_verification_code || "-"}</p>
              </div>

              {/* Additional Info */}
              <div className="pb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Additional Information</h3>
                {/* <p><span className="font-medium">Bio: </span>{viewingUser.bio || "-"}</p> */}
                <p><span className="font-medium">Guarantee: </span>{viewingUser.guarantee_for_service || "-"}</p>
                <p><span className="font-medium">Comment: </span>{viewingUser.additional_comment || "-"}</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold transition-colors"
              onClick={handleCloseViewModal}
            >
              ×
            </button>
          </div>
        </div>
      )}

    </div>
  );

  
}
