import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function AllInstrument({ instrumentsData }) {
  const [instruments, setInstruments] = useState([]);
  const [editingInstrument, setEditingInstrument] = useState(null);
  const [viewInstrument, setViewInstrument] = useState(null);

  // ---------------- MAP BACKEND RESPONSE ---------------- //
  useEffect(() => {
    if (!instrumentsData) return;

    const mappedData = instrumentsData.map((inst) => ({
      ...inst,
      id: inst.instrument_id,
      name: inst.instrument_name,
      category: inst.instrument_type,
      serialNo: inst.model || "-",
      active: inst.record_status === 0,
      acquiredOn: inst.date_commencement_operation,
      notes: inst.inst_description,
    }));

    setInstruments(mappedData);
  }, [instrumentsData]);

  // ---------------- ACTION HANDLERS ---------------- //
  const handleEditClick = (instrument) => setEditingInstrument({ ...instrument });
  const handleViewClick = (instrument) => setViewInstrument(instrument);
  const handleCloseModal = () => {
    setEditingInstrument(null);
    setViewInstrument(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingInstrument((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
  try {
    // ✅ Call the backend PUT endpoint
    const response = await fetch(
      `http://localhost/instrument-care-back-end/public/admin/instrument${editingInstrument.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingInstrument),
      }
    );

    const result = await response.json();

    if (response.ok) {
      // ✅ Update frontend state
      setInstruments((prev) =>
        prev.map((inst) =>
          inst.id === editingInstrument.id ? editingInstrument : inst
        )
      );
      alert(result.message || "Instrument updated successfully");
      handleCloseModal();
    } else {
      alert(result.error || "Failed to update instrument");
    }
  } catch (error) {
    console.error("Error updating instrument:", error);
    alert("Something went wrong while updating instrument");
  }
};


  const handleDelete = async (id) => {
  const confirmed = window.confirm("Delete this instrument?");
  if (!confirmed) return;

  try {
    const response = await fetch(
      `http://localhost/instrument-care-back-end/public/admin/instrument/${id}`,
      {
        method: "DELETE",
      }
    );

    const result = await response.json();

    if (response.ok) {
      // ✅ Remove the instrument from frontend state
      setInstruments((prev) => prev.filter((inst) => inst.id !== id));
      alert(result.message || "Instrument deleted successfully");
    } else {
      alert(result.message || "Failed to delete instrument");
    }
  } catch (error) {
    console.error("Error deleting instrument:", error);
    alert("Something went wrong while deleting instrument");
  }
};


  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">All Instruments</h3>
      </div>

      {/* ---------------- MAIN TABLE ---------------- */}
      <div className="overflow-x-auto">
        {instruments.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No instruments found.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">Name</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Acquired On</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {instruments.map((inst, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3">{inst.name}</td>
                    <td className="p-3">{inst.category}</td>
                    <td className="p-3">{inst.serialNo}</td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={inst.active}
                        readOnly
                        className="w-5 h-5 accent-orange-600"
                      />
                    </td>
                    <td className="p-3">{inst.acquiredOn}</td>

                    <td className="p-3 flex gap-4 text-lg">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewClick(inst)}
                      >
                        <FaEye />
                      </button>

                      <button
                        className="text-orange-600 hover:text-orange-800"
                        onClick={() => handleEditClick(inst)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(inst.id)}
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

      {/* ---------------------- VIEW POPUP (Wide Modern Glass Card) ---------------------- */}
      {viewInstrument && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl w-full max-w-[1400px] max-h-[80vh] overflow-y-auto shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-orange-600">
              Instrument Details
            </h2>

            {/* SECTION: BASIC INFO */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <p><strong>Name:</strong> {viewInstrument.instrument_name}</p>
                <p><strong>Type:</strong> {viewInstrument.instrument_type}</p>
                <p><strong>Manufacturer:</strong> {viewInstrument.manufacturer}</p>
                <p><strong>Model:</strong> {viewInstrument.model}</p>
                <p><strong>Year:</strong> {viewInstrument.year_of_manufacture}</p>
                <p className="col-span-2">
                  <strong>Description:</strong>
                  <div
                    className="p-2 border rounded mt-1"
                    dangerouslySetInnerHTML={{ __html: viewInstrument.inst_description || "" }}
                  />
                </p>
              </div>
            </div>

            {/* SECTION: LOCATION */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Location</h3>
              <div className="grid grid-cols-2 gap-6">
                <p><strong>Institute:</strong> {viewInstrument.institute_id}</p>
                <p><strong>Faculty:</strong> {viewInstrument.faculty_id}</p>
                <p><strong>Department:</strong> {viewInstrument.department_id}</p>
                <p><strong>Laboratory:</strong> {viewInstrument.laboratory_id}</p>
              </div>
            </div>

            {/* SECTION: VENDOR */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Vendor / Supplier</h3>
              <div className="grid grid-cols-2 gap-6">
                <p><strong>Vendor Name:</strong> {viewInstrument.vendor_name}</p>
                <p><strong>Contact:</strong> {viewInstrument.vendor_contact}</p>
                <p><strong>URL:</strong> {viewInstrument.vendor_url}</p>
                <p><strong>Price:</strong> {viewInstrument.price}</p>
                <p><strong>Service Charge:</strong> {viewInstrument.service_charge}</p>
              </div>
            </div>

            {/* SECTION: OPERATION */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Operational Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <p><strong>Samples/Cycle:</strong> {viewInstrument.no_of_samples_per_cycle}</p>
                <p><strong>Samples/Day:</strong> {viewInstrument.no_of_samples_per_day}</p>
                <p><strong>Usage Hours/Day:</strong> {viewInstrument.total_usage_hour_per_day}</p>
                <p><strong>Commencement Operation:</strong> {viewInstrument.date_commencement_operation}</p>
              </div>
            </div>

            {/* SECTION: CONTACT PERSON */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Contact Person</h3>
              <div className="grid grid-cols-2 gap-6">
                <p><strong>Name:</strong> {viewInstrument.contact_person_name}</p>
                <p><strong>Email:</strong> {viewInstrument.contact_person_email}</p>
                <p><strong>Phone:</strong> {viewInstrument.contact_person_phone_number}</p>
                <p><strong>Mobile:</strong> {viewInstrument.contact_person_mobile_number}</p>
              </div>
            </div>

            {/* SECTION: OTHER */}
            <div className="mb-6">
              <h3 className="font-semibold text-xl mb-2">Other Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <p><strong>Accessories:</strong> {viewInstrument.accessories}</p>
                <p><strong>Specification:</strong> {viewInstrument.specification}</p>
                <p><strong>Funding Source:</strong> {viewInstrument.funding_source}</p>
                <p><strong>Keywords:</strong> {viewInstrument.inst_keywords}</p>
                <p><strong>External Researchers:</strong> {viewInstrument.external_researchers}</p>
                <p><strong>Staff Availability:</strong> {viewInstrument.availabiltiy_of_staff}</p>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- EDIT POPUP (Wide Modern Glass Card) ---------------------- */}
      {editingInstrument && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white/90 backdrop-blur-lg p-8 rounded-2xl w-full max-w-[1400px] max-h-[80vh] overflow-y-auto shadow-xl border border-white/20">
            <h2 className="text-3xl font-bold mb-6 border-b pb-2 text-orange-600">
              Edit Instrument
            </h2>

            {/* FULL DYNAMIC FORM */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(editingInstrument).map(([key, value]) => {
                if (key === "inst_description") {
                  return (
                    <div key={key} className="col-span-3">
                      <label className="font-medium capitalize">{key.replace(/_/g, " ")}</label>
                      <textarea
                        name={key}
                        value={value || ""}
                        onChange={handleChange}
                        className="mt-1 border rounded p-2 w-full bg-gray-100"
                        rows={5}
                      />
                    </div>
                  );
                }

                return (
                  <div key={key}>
                    <label className="font-medium capitalize">{key.replace(/_/g, " ")}</label>
                    <input
                      type="text"
                      name={key}
                      value={value || ""}
                      onChange={handleChange}
                      className="mt-1 border rounded p-2 w-full bg-gray-100"
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-gray-200 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-500 transition font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
