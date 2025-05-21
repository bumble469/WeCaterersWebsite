'use client';
import { useEffect, useState } from "react";
import { FaHome, FaShoppingCart, FaConciergeBell, FaUser, FaUtensils, FaSignOutAlt } from "react-icons/fa";
import Header from "@/components/headers/header";
import CatererDashboardOverview from "./components/overview";
import CatererDashboardOrders from "./components/orders";
import CatererDashboardServices from "./components/services";
import CatererDashboardProfile from "./components/profile";
import CatererDashboardMenu from './components/menu';
import axios from "axios";

const CatererDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingOrders, setPendingOrders] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/caterer/orders', { withCredentials: true });
        if (response.status === 200) {
          const orders = response.data;
          console.log("Fetched Orders:", orders);
          const pendingCount = orders.filter(order => order.status === 'Pending').length;
          setPendingOrders(pendingCount);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            const refreshRes = await axios.post('/api/auth/caterer/refreshtoken', {}, {
              withCredentials: true,
            });

            if (refreshRes.status === 200) {
              return fetchOrders();
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr.message);
          }
        }
        console.error(err);
      } 
    };

    fetchOrders();
  }, [activeTab]);

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
    { name: 'Logout', route: '#', icon: <FaSignOutAlt />, type:"caterer" },
  ];

  return (
    <>
      <Header links={links} setActiveTab={setActiveTab} activeTab={activeTab} pendingOrders={pendingOrders} />
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
