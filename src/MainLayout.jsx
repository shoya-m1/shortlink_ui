// src/layouts/MainLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom'; // 👈 PENTING
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardFooter from './components/DashboardFooter';

export default function MainLayout() {
  // Pindahkan state manajemen sidebar ke sini
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-3 md:p-5 md:px-6 md:py-5">
          {/* Outlet akan merender komponen rute anak */}
          <Outlet /> 
        </main>

        <DashboardFooter />
      </div>

      {/* Overlay Mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
}