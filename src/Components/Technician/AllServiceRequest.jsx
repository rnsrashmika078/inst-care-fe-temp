// import React, { useEffect, useState } from "react";

// export default function AllServiceRequestTable() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selectedRequest, setSelectedRequest] = useState(null);

//   const token = sessionStorage.getItem("token");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const techId = sessionStorage.getItem("technician_id");
//         if (!techId) {
//           setError("Technician ID not found in local storage.");
//           setLoading(false);
//           return;
//         }

//         const response = await fetch(
//           `http://localhost/instrument-care-back-end/public/user/service-request/${techId}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               "Authorization": `Bearer ${token}`,
//             },
//           }
//         );

//         if (!response.ok) throw new Error("Failed to fetch service requests");

//         const data = await response.json();
//         // Handle array or { requests: [...] } format
//         if (Array.isArray(data)) {
//           setRequests(data);
//         } else if (data && Array.isArray(data.requests)) {
//           setRequests(data.requests);
//         } else {
//           setRequests([]);
//           setError("No valid service request data found.");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load service requests.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleRowClick = (request) => {
//     setSelectedRequest(request);
//   };

//   const closeModal = () => {
//     setSelectedRequest(null);
//   };

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "pending":
//         return "bg-yellow-200 text-yellow-800";
//       case "completed":
//         return "bg-green-200 text-green-800";
//       case "in progress":
//         return "bg-blue-200 text-blue-800";
//       case "rejected":
//         return "bg-red-200 text-red-800";
//       default:
//         return "bg-gray-200 text-gray-800";
//     }
//   };

//   const filteredRequests = requests.filter((request) => {
//     // 1. Search filter
//     const searchStr = searchTerm.toLowerCase();
//     const matchesSearch =
//       `SR/${request.id}`.toLowerCase().includes(searchStr) ||
//       (request.full_name || "").toLowerCase().includes(searchStr) ||
//       (request.instrument_name || "").toLowerCase().includes(searchStr) ||
//       (request.physical_address || "").toLowerCase().includes(searchStr);

//     // 2. Status filter
//     const matchesStatus =
//       statusFilter === "All" ||
//       (request.status || "").toLowerCase() === statusFilter.toLowerCase();

//     // 3. Date filter
//     const reqDate = new Date(request.created_at);
//     reqDate.setHours(0, 0, 0, 0);

//     let matchesStartDate = true;
//     if (startDate) {
//       const sDate = new Date(startDate);
//       sDate.setHours(0, 0, 0, 0);
//       matchesStartDate = reqDate >= sDate;
//     }

//     let matchesEndDate = true;
//     if (endDate) {
//       const eDate = new Date(endDate);
//       eDate.setHours(0, 0, 0, 0);
//       matchesEndDate = reqDate <= eDate;
//     }

//     return matchesSearch && matchesStatus && matchesStartDate && matchesEndDate;
//   });

//   return (
//     <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 mb-6 font-poppins min-h-[780px]">
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-4">

//         <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800">
//           All Service Requests
//         </h3>

//         {/* Filters */}
//         <div className="w-full lg:w-auto flex flex-col sm:flex-row flex-wrap gap-3">

//           {/* Search */}
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full sm:w-[200px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
//           />

//           {/* Status */}
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="w-full sm:w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500"
//           >
//             <option value="All">All Statuses</option>
//             <option value="Pending">Pending</option>
//             <option value="In Progress">In Progress</option>
//             <option value="Completed">Completed</option>
//             <option value="Rejected">Rejected</option>
//           </select>

//           {/* Dates */}
//           <div className="flex w-full sm:w-auto gap-2">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
//             />
//             <input
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm"
//             />
//           </div>

//         </div>
//       </div>

//       <div className="mb-4">
//         <p className="text-gray-500 italic text-sm">*Please click on the row if available to view more details</p>
//       </div>

//       {loading ? (
//         <p className="text-gray-500 italic p-4 text-center">
//           Loading service requests...
//         </p>
//       ) : error ? (
//         <p className="text-red-500 italic p-4 text-center">{error}</p>
//       ) : requests.length === 0 ? (
//         <p className="text-gray-500 italic p-4 text-center">
//           No service requests found.
//         </p>
//       ) : filteredRequests.length === 0 ? (
//         <p className="text-gray-500 italic p-4 text-center">
//           No matching service requests found based on your filters.
//         </p>
//       ) : (
//         <div className="overflow-x-auto max-h-[720px]">

//           <table className="w-full text-xs sm:text-sm border-collapse min-w-[600px]">

//             <thead className="bg-orange-100 sticky top-0 z-10">
//               <tr>
//                 <th className="p-2">ID</th>
//                 <th className="p-2">Client</th>
//                 <th className="p-2 hidden sm:table-cell">Instrument</th>
//                 <th className="p-2 hidden md:table-cell">Date</th>
//                 <th className="p-2 hidden lg:table-cell">Location</th>
//                 <th className="p-2">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredRequests.map((request) => (
//                 <tr
//                   key={request.id}
//                   onClick={() => handleRowClick(request)}
//                   className="border-b cursor-pointer hover:bg-orange-50 transition"
//                 >
//                   {/* ID */}
//                   <td className="p-2 font-semibold">
//                     SR/{request.id}
//                   </td>

//                   {/* Client + stacked info */}
//                   <td className="p-2">
//                     <div className="font-medium">{request.full_name}</div>

//                     {/* Show extra info only on mobile */}
//                     <div className="text-xs text-gray-500 sm:hidden">
//                       {request.instrument_name}
//                     </div>
//                     <div className="text-xs text-gray-400 md:hidden">
//                       {new Date(request.created_at).toLocaleDateString()}
//                     </div>
//                   </td>

//                   {/* Hidden columns */}
//                   <td className="p-2 hidden sm:table-cell">
//                     {request.instrument_name}
//                   </td>

//                   <td className="p-2 hidden md:table-cell">
//                     {new Date(request.created_at).toLocaleDateString()}
//                   </td>

//                   <td className="p-2 hidden lg:table-cell truncate max-w-[200px]">
//                     {request.physical_address}
//                   </td>

//                   {/* Status */}
//                   <td className="p-2">
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${getStatusColor(
//                         request.status
//                       )}`}
//                     >
//                       {request.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {selectedRequest && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           {/* Overlay */}
//           <div
//             className="absolute inset-0 bg-[#ffffff50] bg-opacity-50 backdrop-blur-sm transition-opacity"
//             onClick={closeModal}
//           />

//           {/* Modal content */}
//           <div className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl p-4 sm:p-6 lg:p-8 z-10 transform scale-95 opacity-0 animate-scale-fade">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-lg sm:text-xl lg:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
//                 Service Request Details
//               </h2>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-500 hover:text-gray-800 font-bold text-3xl transition"
//               >
//                 &times;
//               </button>
//             </div>

//             {/* Details Table */}
//             <div className="overflow-x-auto max-h-[70vh]">
//               <table className="w-full text-left text-sm border border-gray-200 rounded-xl overflow-hidden">
//                 <tbody>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Request ID</td>
//                     <td className="p-3 text-gray-800 break-words text-xs lg:text-base">SR/{selectedRequest.id}</td>
//                   </tr>
//                   <tr>
//                     <td className="p-3 font-bold text-black w-1/3 text-xs lg:text-base">Client Details</td>
//                     <td className="p-3 text-xs lg:text-base"></td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Client Name</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.full_name}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Email</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.email}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Address</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.physical_address}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Contact Number</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.contact_number}</td>
//                   </tr>
//                   <tr>
//                     <td className="p-3 font-bold text-black w-1/3 text-xs lg:text-base">Institute Details</td>
//                     <td className="p-3 text-xs lg:text-base"></td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Institute Name</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.institute_name}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Institute Address</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.institute_address}</td>
//                   </tr>
//                   <tr>
//                     <td className="p-3 font-bold text-black w-1/3 text-xs lg:text-base">Instrument Details</td>
//                     <td className="p-3 text-xs lg:text-base"></td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Instrument Name</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.instrument_name}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Instrument Brand</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.instrument_brand}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Instrument Model</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.instrument_model}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Instrument Manufacturer</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.instrument_manufacturer}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Manufactured Year</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.manufactured_year}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Product Testing Type</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.product_testing_type}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Testing Parameter</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.testing_parameter}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Consumption Period</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.consumption_period}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Problem Description</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.issue_description}</td>
//                   </tr>
//                   <tr>
//                     <td className="p-3 font-bold text-black w-1/3 text-xs lg:text-base">Feedback</td>
//                     <td className="p-3 text-xs lg:text-base"></td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Rate</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.rate}</td>
//                   </tr>
//                   <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
//                     <td className="p-3 font-semibold text-gray-600 w-1/3 bg-gray-50 text-xs lg:text-base">Review</td>
//                     <td className="p-3 text-xs lg:text-base">{selectedRequest.review}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>

//             {/* Close Button */}
//             <div className="mt-6 text-right">
//               <button
//                 onClick={closeModal}
//                 className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-sm hover:from-orange-400 hover:to-orange-500 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Tailwind Animation */}
//       <style>
//         {`
//           @keyframes scale-fade {
//             0% { transform: scale(0.95); opacity: 0; }
//             100% { transform: scale(1); opacity: 1; }
//           }
//           .animate-scale-fade {
//             animation: scale-fade 0.25s ease-out forwards;
//           }
//         `}
//       </style>
//     </div>
//   );
// }


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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch service requests");

        const data = await response.json();
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

  const handleRowClick = (request) => setSelectedRequest(request);
  const closeModal = () => setSelectedRequest(null);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "completed": return "bg-green-100 text-green-800 border border-green-300";
      case "in progress": return "bg-blue-100 text-blue-800 border border-blue-300";
      case "rejected": return "bg-red-100 text-red-800 border border-red-300";
      default: return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const filteredRequests = requests.filter((request) => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch =
      `SR/${request.id}`.toLowerCase().includes(searchStr) ||
      (request.full_name || "").toLowerCase().includes(searchStr) ||
      (request.instrument_name || "").toLowerCase().includes(searchStr) ||
      (request.physical_address || "").toLowerCase().includes(searchStr);

    const matchesStatus =
      statusFilter === "All" ||
      (request.status || "").toLowerCase() === statusFilter.toLowerCase();

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
    <div className="bg-white/80 rounded-xl shadow-sm p-3 sm:p-4 mb-6 font-sans min-h-[600px] w-full box-border overflow-hidden">

      {/* ── Header + Filters ── */}
      <div className="flex flex-col gap-3 mb-4">

        <h3 className="font-bold text-base sm:text-lg text-gray-800">
          All Service Requests
        </h3>

        {/* Filter group — always stacks, never overflows */}
        <div className="flex flex-col gap-2 w-full">

          {/* Row 1: Search + Status */}
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Search by ID, client, instrument…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none sm:w-40 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Row 2: Date range */}
          <div className="flex flex-col xs:flex-row gap-2">
            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-xs text-gray-500 mb-1 ml-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <label className="text-xs text-gray-500 mb-1 ml-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            {/* Clear dates */}
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="self-end xs:self-end pb-0 xs:pb-0 mt-0 xs:mt-5 text-xs text-orange-500 underline whitespace-nowrap"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-gray-400 italic text-xs mb-3">
        *Click a row to view full details
      </p>

      {/* ── Content ── */}
      {loading ? (
        <p className="text-gray-500 italic text-center py-10">Loading service requests…</p>
      ) : error ? (
        <p className="text-red-500 italic text-center py-10">{error}</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 italic text-center py-10">No service requests found.</p>
      ) : filteredRequests.length === 0 ? (
        <p className="text-gray-500 italic text-center py-10">No results match your filters.</p>
      ) : (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-xs sm:text-sm border-collapse" style={{ minWidth: "520px" }}>
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr>
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 whitespace-nowrap">ID</th>
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700">Client</th>
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 hidden sm:table-cell whitespace-nowrap">Instrument</th>
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 hidden md:table-cell whitespace-nowrap">Date</th>
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 hidden lg:table-cell">Location</th>
                <th className="p-2 sm:p-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, idx) => (
                <tr
                  key={request.id}
                  onClick={() => handleRowClick(request)}
                  className={`border-t border-gray-100 cursor-pointer hover:bg-orange-50 transition-colors ${idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                >
                  <td className="p-2 sm:p-3 font-semibold text-orange-600 whitespace-nowrap">
                    SR/{request.id}
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="font-medium text-gray-800">{request.full_name}</div>
                    {/* Stacked sub-info on mobile */}
                    <div className="text-xs text-gray-400 sm:hidden mt-0.5">{request.instrument_name}</div>
                    <div className="text-xs text-gray-400 md:hidden mt-0.5">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 hidden sm:table-cell text-gray-700">{request.instrument_name}</td>
                  <td className="p-2 sm:p-3 hidden md:table-cell text-gray-700 whitespace-nowrap">
                    {new Date(request.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2 sm:p-3 hidden lg:table-cell text-gray-600 max-w-[180px] truncate">
                    {request.physical_address}
                  </td>
                  <td className="p-2 sm:p-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal ── */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal box */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90dvh] flex flex-col z-10 animate-scale-fade">

            {/* Sticky header */}
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-100 shrink-0">
              <h2 className="text-base sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Service Request Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-700 transition text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-4 sm:px-6 py-4">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <tbody>
                  {[
                    { label: "Request ID", value: `SR/${selectedRequest.id}` },
                    { label: "CLIENT DETAILS", section: true },
                    { label: "Client Name", value: selectedRequest.full_name },
                    { label: "Email", value: selectedRequest.email },
                    { label: "Address", value: selectedRequest.physical_address },
                    { label: "Contact Number", value: selectedRequest.contact_number },
                    { label: "INSTITUTE DETAILS", section: true },
                    { label: "Institute Name", value: selectedRequest.institute_name },
                    { label: "Institute Address", value: selectedRequest.institute_address },
                    { label: "INSTRUMENT DETAILS", section: true },
                    { label: "Instrument Name", value: selectedRequest.instrument_name },
                    { label: "Brand", value: selectedRequest.instrument_brand },
                    { label: "Model", value: selectedRequest.instrument_model },
                    { label: "Manufacturer", value: selectedRequest.instrument_manufacturer },
                    { label: "Manufactured Year", value: selectedRequest.manufactured_year },
                    { label: "Product Testing Type", value: selectedRequest.product_testing_type },
                    { label: "Testing Parameter", value: selectedRequest.testing_parameter },
                    { label: "Consumption Period", value: selectedRequest.consumption_period },
                    { label: "Problem Description", value: selectedRequest.issue_description },
                    { label: "FEEDBACK", section: true },
                    { label: "Rate", value: selectedRequest.rate },
                    { label: "Review", value: selectedRequest.review },
                  ].map((row, i) =>
                    row.section ? (
                      <tr key={i}>
                        <td colSpan={2} className="pt-4 pb-1 px-2 font-bold text-gray-800 text-xs uppercase tracking-widest">
                          {row.label}
                        </td>
                      </tr>
                    ) : (
                      <tr key={i} className="border-b border-gray-100 hover:bg-orange-50/40 transition-colors">
                        <td className="py-2 px-2 sm:px-3 font-medium text-gray-500 w-2/5 align-top whitespace-nowrap">{row.label}</td>
                        <td className="py-2 px-2 sm:px-3 text-gray-800 break-words">{row.value || "—"}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Sticky footer */}
            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 shrink-0 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:from-orange-400 hover:to-orange-500 transition-all active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scale-fade {
          from { transform: scale(0.96); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .animate-scale-fade { animation: scale-fade 0.2s ease-out forwards; }
      `}</style>
    </div>
  );
}