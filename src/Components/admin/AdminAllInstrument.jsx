import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function AllInstrument({ instrumentsData }) {
  return (
    <div className="bg-[#ffffff80] rounded-lg shadow-sm p-4 font-poppins min-h-[720px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">All Instruments</h3>
      </div>
      <div className="overflow-x-auto">
        {instrumentsData.length === 0 ? (
          <p className="text-gray-500 italic p-4 text-center">
            No instruments found.
          </p>
        ) : (
          <div className="max-h-[720px] overflow-y-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-700">
                  <th className="p-3">ID</th>
                  <th className="p-3">Technician ID</th>
                  <th className="p-3">Instrument ID</th>
                  <th className="p-3">New Instrument ID</th>
                  <th className="p-3">Created At</th>
                </tr>
              </thead>

              <tbody>
                {instrumentsData.map((inst, i) => (
                  <tr
                    key={i}
                    className="border-b hover:bg-orange-50 transition-colors"
                  >
                    <td className="p-3">{inst.id}</td>
                    <td className="p-3">{inst.technician_id}</td>
                    <td className="p-3">{inst.instrument_id}</td>
                    <td className="p-3">{inst.new_instrument_id}</td>
                    <td className="p-3">{inst.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
