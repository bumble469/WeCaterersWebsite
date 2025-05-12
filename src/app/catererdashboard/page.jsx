'use client';
import { useState } from "react";
import { FaHome, FaShoppingCart, FaConciergeBell, FaUser, FaUtensils, FaSignOutAlt } from "react-icons/fa";
import Header from "@/components/headers/header";
import CatererDashboardOverview from "./components/overview";
import CatererDashboardOrders from "./components/orders";
import CatererDashboardServices from "./components/services";
import CatererDashboardProfile from "./components/profile";
import CatererDashboardMenu from './components/menu';

const CatererDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <CatererDashboardOverview />;
      case 'orders':
        return <CatererDashboardOrders />;
      case 'services':
        return <CatererDashboardServices />;
      case 'profile':
        return <CatererDashboardProfile />;
      case 'menu':
        return <CatererDashboardMenu />
      default:
        return null;
    }
  };

  const links = [
    { name: 'Overview', route: '#', tab: 'overview', icon: <FaHome /> },
    { name: 'Orders', route: '#', tab: 'orders', icon: <FaShoppingCart /> },
    { name: 'Services', route: '#', tab: 'services', icon: <FaConciergeBell /> },
    { name: 'Menu', route: '#', tab: 'menu', icon: <FaUtensils /> },
    { name: 'Profile', route: '#', tab: 'profile', icon: <FaUser /> },
    { name: 'Logout', route: '/', icon: <FaSignOutAlt /> },
  ];

  return (
    <>
      <Header links={links} setActiveTab={setActiveTab} activeTab={activeTab} />
      <div className="h-screen">
        <div className="flex h-full pt-[130px] bg-gray-100">
          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            {renderContent()}
          </main>
        </div>
      </div>
    </>
  );
};

export default CatererDashboard;
