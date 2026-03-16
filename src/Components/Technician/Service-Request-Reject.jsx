import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ServiceRequestReject({
  initialFormData = {
    ownerEmail: "",
    yourEmail: "",
    subject: "",
    message: "",
  },
  onBack = () => {},
  onSend = () => {},
}) {
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-lg p-4 sm:p-6 w-full mx-auto shadow bg-[#ff000015]">
      {/* Section Title */}
      <h3 className="mb-2 font-bold text-lg">Reject the Service Request</h3>
      <hr className="mb-4" />

      {/* Form */}
      <form className="space-y-4">
        {/* Owner Email */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Owner Email Address
          </label>
          <input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => handleChange("ownerEmail", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        {/* Your Email */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Your Email Address
          </label>
          <input
            type="email"
            value={formData.yourEmail}
            onChange={(e) => handleChange("yourEmail", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Subject
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        {/* Message */}
        <div className="flex flex-col sm:flex-row sm:items-start">
          <label className="font-semibold w-full sm:w-1/3 mb-1 sm:mb-0">
            Message
          </label>
          <textarea
            rows="5"
            value={formData.message}
            onChange={(e) => handleChange("message", e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-2/3"
          />
        </div>

        <hr className="mt-4" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-4">
          <Link to='/tech/service-request'>
            <button
              type="button"
              onClick={onBack}
              className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-md font-semibold w-md"
            >
              Back
            </button>
          </Link>
          <button
            type="button"
            onClick={() => onSend(formData)}
            className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-md font-semibold w-md"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
