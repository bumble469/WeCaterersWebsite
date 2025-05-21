'use client';
import { useState } from 'react';
import Header from "@/components/headers/header";

import { 
  FaHome, 
  FaUsers, 
  FaConciergeBell, 
  FaShoppingCart, 
  FaSignOutAlt 
} from 'react-icons/fa';

import AdminOverview from "./components/overview";
import AdminUsers from "./components/users";
import AdminCaterers from "./components/caterers";
import AdminOrders from "./components/orders";

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
      default:
        return null;
    }
  };

  const links = [
    { name: 'Overview', route: '#', tab: 'overview', icon: <FaHome /> },
    { name: 'Users', route: '#', tab: 'users', icon: <FaUsers /> },
    { name: 'Caterers', route: '#', tab: 'caterers', icon: <FaConciergeBell /> },
    { name: 'Orders', route: '#', tab: 'orders', icon: <FaShoppingCart /> },
    { name: 'Logout', route: '/', icon: <FaSignOutAlt />, type:"admin" },
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
