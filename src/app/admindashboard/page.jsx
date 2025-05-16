'use client';
import { useState } from 'react';
import Header from "@/components/headers/header";

import { 
  FaHome, 
  FaUsers, 
  FaConciergeBell, 
  FaShoppingCart, 
  FaUser, 
  FaSignOutAlt 
} from 'react-icons/fa';

import AdminOverview from "./components/overview";
import AdminUsers from "./components/users";
import AdminCaterers from "./components/caterers";
import AdminOrders from "./components/orders";
import AdminProfile from "./components/profile";

const CatererDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />;
      case 'users':
        return <AdminUsers />;
      case 'caterers':
        return <AdminCaterers />;
      case 'orders':
        return <AdminOrders />;
      case 'profile':
        return <AdminProfile />;
      default:
        return null;
    }
  };

  const links = [
    { name: 'Overview', route: '#', tab: 'overview', icon: <FaHome /> },
    { name: 'Users', route: '#', tab: 'users', icon: <FaUsers /> },
    { name: 'Caterers', route: '#', tab: 'caterers', icon: <FaConciergeBell /> },
    { name: 'Orders', route: '#', tab: 'orders', icon: <FaShoppingCart /> },
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
