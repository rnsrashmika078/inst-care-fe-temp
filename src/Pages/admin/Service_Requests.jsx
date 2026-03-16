import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Technician/Navbar';
import Admin_Sidebar from '../../Components/admin/Sidebar';
import AdminAllServiceRequest from '../../Components/admin/AdminAllServiceRequest';
import Footer from '../../Components/Common/Footer';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function All_Service_Requests() {
  const [requestsData, setRequestsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          'http://localhost/instrument-care-back-end/public/admin/service-requests'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch service requests');
        }

        const data = await response.json();

        // ✅ KEEP EVERYTHING — ADD NOTHING REMOVED
        const mappedData = data.map((req) => ({
          ...req, // 🔥 THIS IS THE FIX — FULL RESPONSE OBJECT

          // existing UI fields (unchanged)
          requesterName: req.full_name,
          instrument: req.instrument_name,
          requestedOn: req.created_at?.split(' ')[0],
          // notes: req.issue_description,
        }));

        setRequestsData(mappedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service requests:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <>
      <Navbar />

      <div
        className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})` }}
      >
        <Admin_Sidebar />

        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">All Service Requests</h2>

          {loading ? (
            <p className="text-gray-500 italic p-4 text-center">
              Loading service requests...
            </p>
          ) : (
            <AdminAllServiceRequest requestsData={requestsData} />
          )}
        </main>
      </div>

      <Footer />
    </>
  );
}
