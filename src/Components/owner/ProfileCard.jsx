import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultProfileImage from '../../assets/images/profile-image.jpeg';

export default function ProfileCard() {
  const { id } = useParams(); // get technician id from URL
  const [tech, setTech] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [instrumentsCategories, setInstrumentsCategories] = useState([]);
  const [laboratoryCategories, setLaboratoryCategories] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);


  useEffect(() => {
    const fetchTechnician = async () => {
      try {
        const response = await fetch(`http://localhost/instrument-care-back-end/public/user/dashboard/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch technician");
        const data = await response.json();
        setTech(data);
      } catch (error) {
        console.error("Error fetching technician:", error);
      }
    };

    fetchTechnician();
  }, [id]);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/service-request/${id}/instruments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!response.ok) throw new Error("Failed to fetch instruments");

        const data = await response.json();
        setInstruments(data.instruments || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    if (id) {
      fetchInstruments();
    }
  }, [id]);

  useEffect(() => {
    const fetchInstrumentsCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/service-request/${id}/instrument-categories`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!response.ok) throw new Error("Failed to fetch instruments categories");

        const data = await response.json();
        setInstrumentsCategories(data.instrumentsCategories || []);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      }
    };

    if (id) {
      fetchInstrumentsCategories();
    }
  }, [id]);

  useEffect(() => {
    const fetchInstrumentsCategories = async () => {
      try {
        const response = await fetch(
          `http://localhost/instrument-care-back-end/public/service-request/${id}/laboratory-categories`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (!response.ok) throw new Error("Failed to fetch laboratory categories");

        const data = await response.json();
        setLaboratoryCategories(data.laboratoryCategories || []);
      } catch (error) {
        console.error("Error fetching laboratory categories:", error);
      }
    };

    if (id) {
      fetchInstrumentsCategories();
    }
  }, [id]);

  useEffect(() => {
    const fetchTechnicianWorkExperience = async () => {
      try {
        const res = await fetch(
          `http://localhost/instrument-care-back-end/public/tech/work-experience/${id}`
        );
        const result = await res.json();
        setWorkExperiences(result.data || []);
      } catch (error) {
        console.error("Error fetching work experiences:", error);
        setWorkExperiences([]);
      }
    };

    if (id) {
      fetchTechnicianWorkExperience();
    }
  }, [id]);

  useEffect(() => {
    const fetchTechnicianCertificates = async () => {
      try {
        const res = await fetch(
          `http://localhost/instrument-care-back-end/public/tech/certificates/${id}`
        );
        const result = await res.json();
        console.log("From API:", result);
        setCertificates(result.data || []);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
      }
    };

    if (id) {
      fetchTechnicianCertificates();
    }
  }, [id]);

  if (!tech) {
    return <div className="p-4">Loading profile...</div>;
  }

  // Determine which profile image to show
  const profileImageUrl = tech.profile_image !== null
    ? `http://localhost/instrument-care-back-end/public/${tech.profile_image}`
    : DefaultProfileImage;

  // return (
  //   <div className="border rounded-md p-4 flex flex-col gap-4 font-poppins bg-[#ffffff80]">
  //     {/* Profile Info */}
  //     <div className="flex items-center gap-4">
  //       <div className="border rounded-full flex items-center justify-center mb-2">
  //         <img
  //           src={profileImageUrl}
  //           alt={tech.full_name || "Profile"}
  //           className="h-20 w-20 rounded-full object-cover cursor-pointer border border-gray-300 hover:scale-105 transition-transform"
  //         />
  //       </div>
  //       <div>
  //         <h2 className="font-bold text-lg">{tech.title} {tech.full_name || "N/A"}</h2>
  //         <p className="text-gray-500 text-sm">{tech.current_designation || "-"}</p>
  //       </div>
  //     </div>

  //     {/* Technical Expertise */}
  //     <div>
  //       <h3 className="font-bold">Technical Expertise</h3>
  //       <ul className="text-sm space-y-2">
  //         <li className="flex items-start gap-2">
  //           <span className="font-semibold text-gray-700">
  //             Instruments Expertise:
  //           </span>
  //           <div className="flex flex-wrap gap-2">
  //             {instruments.length > 0 ? (
  //               instruments.map((instrument) => (
  //                 <span
  //                   key={instrument.id}
  //                   className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
  //                 >
  //                   {instrument.instrument_name}
  //                 </span>
  //               ))
  //             ) : (
  //               <span className="text-gray-500 text-xs">N/A</span>
  //             )}
  //           </div>
  //         </li>

  //         <li className="flex items-start gap-2">
  //           <span className="font-semibold text-gray-700">
  //             Instruments Category:
  //           </span>

  //           <div className="flex flex-wrap gap-2">
  //             {instrumentsCategories.length > 0 ? (
  //               instrumentsCategories.map((instrumentCategory) => (
  //                 <span
  //                   key={instrumentCategory.id}
  //                   className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
  //                 >
  //                   {instrumentCategory.name}
  //                 </span>
  //               ))
  //             ) : (
  //               <span className="text-gray-500 text-xs">N/A</span>
  //             )}
  //           </div>
  //         </li>

  //         <li className="flex items-start gap-2">
  //           <span className="font-semibold text-gray-700">
  //             Laboratory Category:
  //           </span>
  //           <div className="flex flex-wrap gap-2">
  //             {laboratoryCategories.length > 0 ? (
  //               laboratoryCategories.map((laboratoryCategory) => (
  //                 <span
  //                   key={laboratoryCategory.id}
  //                   className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
  //                 >
  //                   {laboratoryCategory.name}
  //                 </span>
  //               ))
  //             ) : (
  //               <span className="text-gray-500 text-xs">N/A</span>
  //             )}
  //           </div>
  //         </li>
  //       </ul>
  //     </div>
  //     <hr />

  //     {/* About */}
  //     <div>
  //       <h3 className="font-bold">About</h3>
  //       <p className="text-sm text-gray-600">{tech.bio || "-"}</p>
  //     </div>
  //     <hr />

  //     {/* Qualifications */}
  //     <div>
  //       <h3 className="font-bold">Certificates</h3>
  //       <div className="flex flex-wrap gap-2">
  //         {certificates.length > 0 ? (
  //           certificates.map((certificate, i) => (
  //             <span
  //               key={i}
  //               className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
  //             >
  //               {certificate.oem_company_name} ({certificate.certificate_name}) - {certificate.instrument_name} - {certificate.issue_date} - {certificate.expiry_date}
  //             </span>
  //           ))
  //         ) : (
  //           <span className="text-gray-500 text-xs">N/A</span>
  //         )}
  //       </div>
  //     </div>
  //     <hr />

  //     <div>
  //       <h3 className="font-bold">Institute Details</h3>
  //       <ul className="text-sm text-gray-600 space-y-1">
  //         <li className="font-semibold pl-5">{tech.current_designation || "-"}</li>
  //         <li className="pl-5">{tech.institute_name || "-"}</li>
  //       </ul>
  //     </div>
  //     <hr />

  //     <div>
  //       <h3 className="font-bold">Experiences</h3>
  //       <div className="flex flex-wrap gap-2">
  //         {workExperiences.length > 0 ? (
  //           workExperiences.map((workExperience, i) => (
  //             <span
  //               key={i}
  //               className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold"
  //             >
  //               {workExperience.organization_name} ({workExperience.position_title}) - {workExperience.start_date} to {workExperience.end_date}
  //             </span>
  //           ))
  //         ) : (
  //           <span className="text-gray-500 text-xs">N/A</span>
  //         )}
  //       </div>
  //     </div>

  //   </div>
  // );

  return (
    <div className="bg-[#ffffff80] rounded-xl shadow-sm p-6 font-poppins flex flex-col gap-6">

      {/* Profile Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <img
          src={profileImageUrl}
          alt={tech.full_name || "Profile"}
          className="h-20 w-20 rounded-full object-cover border border-gray-300 hover:scale-105 transition"
        />
        <div>
          <h2 className="text-lg font-bold">
            {tech.title} {tech.full_name || "N/A"}
          </h2>
          <p className="text-sm text-gray-500">
            {tech.current_designation || "-"}
          </p>
        </div>
      </div>

      {/* Technical Expertise */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 text-gray-800">Technical Expertise</h3>

        <div className="flex flex-col gap-3 text-sm">
          {/* Instruments */}
          <div>
            <p className="font-semibold text-gray-600 mb-1">Instruments</p>
            <div className="flex flex-wrap gap-2">
              {instruments.length > 0 ? (
                instruments.map((item) => (
                  <span key={item.id} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {item.instrument_name}
                  </span>
                ))
              ) : <span className="text-gray-400 text-xs">N/A</span>}
            </div>
          </div>

          {/* Categories */}
          <div>
            <p className="font-semibold text-gray-600 mb-1">Instrument Categories</p>
            <div className="flex flex-wrap gap-2">
              {instrumentsCategories.length > 0 ? (
                instrumentsCategories.map((item) => (
                  <span key={item.id} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {item.name}
                  </span>
                ))
              ) : <span className="text-gray-400 text-xs">N/A</span>}
            </div>
          </div>

          {/* Lab Categories */}
          <div>
            <p className="font-semibold text-gray-600 mb-1">Laboratory Categories</p>
            <div className="flex flex-wrap gap-2">
              {laboratoryCategories.length > 0 ? (
                laboratoryCategories.map((item) => (
                  <span key={item.id} className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold">
                    {item.name}
                  </span>
                ))
              ) : <span className="text-gray-400 text-xs">N/A</span>}
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-2 text-gray-800">About</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {tech.bio || "No description available"}
        </p>
      </div>

      {/* Institute */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-2 text-gray-800">Institute</h3>
        <p className="text-sm text-gray-600">
          {tech.current_designation || "-"} <br />
          {tech.institute_name || "-"}
        </p>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 text-gray-800">Certificates</h3>

        {certificates.length > 0 ? (
          <div className="flex flex-col gap-3">
            {certificates.map((c, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                {/* Certificate Name */}
                <p className="font-semibold text-gray-800">
                  {c.certificate_name}
                </p>

                {/* Issuing Organization */}
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-500">Issued By: </span>
                  {c.oem_company_name}
                </p>

                {/* Details */}
                <div className="text-xs text-gray-500 mt-2 flex flex-col gap-1">
                  <div>
                    <span className="font-medium">Instrument: </span>
                    {c.instrument_name || "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Issue Date: </span>
                    {c.issue_date
                      ? new Date(c.issue_date).toLocaleDateString()
                      : "N/A"}
                  </div>

                  <div>
                    <span className="font-medium">Expiry Date: </span>
                    {c.expiry_date
                      ? new Date(c.expiry_date).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No certificates available</span>
        )}
      </div>

      {/* Experience */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h3 className="font-bold mb-3 text-gray-800">Experience</h3>

        {workExperiences.length > 0 ? (
          <div className="flex flex-col gap-3">
            {workExperiences.map((exp, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <p className="font-semibold text-gray-800">
                  {exp.position_title}
                </p>

                <p className="text-sm text-gray-600">
                  {exp.organization_name}
                </p>

                <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-4">
                  <span>
                    <b>Years:</b> {exp.years_of_experience}
                  </span>
                  <span>
                    <b>From:</b>{" "}
                    {new Date(exp.start_date).toLocaleDateString()}
                  </span>
                  <span>
                    <b>To:</b>{" "}
                    {new Date(exp.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">N/A</span>
        )}
      </div>

    </div>
  );
}
