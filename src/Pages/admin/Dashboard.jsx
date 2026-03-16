import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Technician/Navbar';
import Admin_Sidebar from '../../Components/admin/Sidebar';
import AdminDashboardStats from '../../Components/admin/AdminDashboardStstus';
import AdminDashboardLineChart from '../../Components/admin/AdminServiceRequestLineChart';
import Footer from '../../Components/Common/Footer';
import BG from '../../assets/images/technician-dashboard-bg-4.jpg';

export default function Admin_Dashboard() {
  // ✅ State for line chart data
  const [chartData, setChartData] = useState([]);

  // 🔥 Fetch line chart data from backend
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('http://localhost/instrument-care-back-end/public/admin/line-chart');
        const data = await response.json();

        // ✅ Set backend response to chartData
        setChartData(data);
      } catch (error) {
        console.error('Failed to fetch line chart data:', error);
      }
    };

    fetchChartData();
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
          <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
          <AdminDashboardStats />
          <AdminDashboardLineChart data={chartData} />
        </main>
      </div>

      <Footer />
    </>
  );
}
