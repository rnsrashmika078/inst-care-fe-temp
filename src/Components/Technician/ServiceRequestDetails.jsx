// import React from "react";
// import { Link } from "react-router-dom";

// export default function ServiceRequestDetails({ details }) {
//   // If no details are selected, show placeholders instead of real data
//   const placeholder = !details;

//   return (
//     <div className="bg-[#ffffff80] rounded-lg p-4 mt-4">
//       <h3 className="font-bold text-lg mb-3">Detailed View</h3>

//       {/* Owner Details */}
//       <div className="mb-4">
//         <h4 className="font-bold">Owner Details</h4>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
//           <input
//             disabled
//             value={placeholder ? "" : details.full_name}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Full Name"
//           />
//           <input
//             disabled
//             value={placeholder ? "" : details.email}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Email Address"
//           />
//           <input
//             disabled
//             value={placeholder ? "" : details.institute_address}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Physical Address"
//           />
//           <input
//             disabled
//             value={placeholder ? "" : details.contact_number}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Contact Number"
//           />
//         </div>
//       </div>

//       {/* Instrument Details */}
//       <div className="mb-4">
//         <h4 className="font-bold">Instrument Details</h4>
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-2">
//           <input
//             disabled
//             value={placeholder ? "" : details.instrument_name}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Instrument Name"
//           />
//           <input
//             disabled
//             value={placeholder ? "" : details.instrument_model}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Instrument Model"
//           />
//           <input
//             disabled
//             value={placeholder ? "" : details.instrument_manufacturer}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Manufacture"
//           />
//           <input
//             disabled
//             value={placeholder ? "" : details.consumption_period}
//             className="border rounded p-2 bg-gray-100"
//             placeholder="Consumption Period"
//           />
//         </div>
//       </div>

//       {/* Description */}
//       <textarea
//         disabled
//         value={placeholder ? "" : details.issue_description}
//         className="border rounded p-2 w-full bg-gray-100"
//         rows={3}
//         placeholder="Description About Issue"
//       ></textarea>

//       {/* Action Buttons */}
//       <div className="flex justify-center gap-4 mt-4 sm:justify-end">
//         <Link to='/tech/reject-service-request'>
//         <button className="bg-red-500 text-white px-6 py-2 rounded font-bold w-md">
//           Reject
//         </button>
//         </Link>
//         <Link to='/tech/accept-service-request'>
//         <button className="bg-green-500 text-white px-6 py-2 rounded font-bold w-md">
//           Accept
//         </button>
//         </Link>
//       </div>
//     </div>
//   );
// }


import React from "react";
import { Link } from "react-router-dom";

export default function ServiceRequestDetails({ details }) {
  const placeholder = !details;

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">
        {placeholder ? "-" : value || "-"}
      </span>
    </div>
  );

  return (
    <div className="bg-[#ffffff80] rounded-lg p-5 mt-4 shadow-sm">
      <h3 className="font-bold text-lg mb-4">Detailed View</h3>

      {/* Owner Details */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Owner Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 border">
          <Field label="Full Name" value={details?.full_name} />
          <Field label="Email Address" value={details?.email} />
          <Field label="Physical Address" value={details?.institute_address} />
          <Field label="Contact Number" value={details?.contact_number} />
        </div>
      </div>

      {/* Instrument Details */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-3">Instrument Details</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-lg p-4 border">
          <Field label="Instrument Name" value={details?.instrument_name} />
          <Field label="Instrument Model" value={details?.instrument_model} />
          <Field label="Manufacturer" value={details?.instrument_manufacturer} />
          <Field label="Consumption Period" value={details?.consumption_period} />
        </div>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-700 mb-2">Issue Description</h4>
        <div className="bg-white border rounded-lg p-4 text-gray-800">
          {placeholder ? "-" : details?.issue_description || "-"}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 sm:justify-end">
        <Link to="/tech/reject-service-request"
          state={{
            request_id: details?.id,
            email: details?.email
          }}
        >
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded font-semibold">
            Reject
          </button>
        </Link>

        <Link to="/tech/accept-service-request"
          state={{
            request_id: details?.id,
            email: details?.email
          }}
        >
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded font-semibold">
            Accept
          </button>
        </Link>
      </div>
    </div>
  );
}