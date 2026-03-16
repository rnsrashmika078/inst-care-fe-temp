import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/Technician/Navbar'
import Admin_Sidebar from '../../Components/admin/Sidebar'
import AllInstrument from '../../Components/admin/AdminAllInstrument';
import Footer from '../../Components/Common/Footer'
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function All_Instruments() {
  const [instruments, setInstruments] = useState([]);

  // ✅ Fetch instruments from backend
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch('http://localhost/instrument-care-back-end/public/admin/instruments');
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setInstruments(result.data);
        } else {
          console.error('Failed to fetch instruments:', result);
        }
      } catch (error) {
        console.error('Error fetching instruments:', error);
      }
    };

    fetchInstruments();
  }, []);

  return (
    <>
      <Navbar />

      {/* Background Image Wrapper */}
      <div
        className="flex flex-col md:flex-row h-full w-full p-2 md:p-4 gap-4 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BG})`,
        }}
      >
        {/* Sidebar */}
        <Admin_Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-[#ffffff80] rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">All Instruments</h2>
          <AllInstrument instrumentsData={instruments} />
        </main>
      </div>

      <Footer />
    </>
  )
}
