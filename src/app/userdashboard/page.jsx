"use client";
import { useState } from "react";
import Header from "@/components/headers/header";
import { motion } from "framer-motion";
import {
  FaHome,
  FaShoppingCart,
  FaClipboardList,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";
import explorepageimage from '../../assets/images/explorepageimage.jpg';
import UserHome from './components/home/home';
import UserCart from "./components/cart/cart";
import UserOrders from "./components/orders/orders";
import UserProfile from "./components/profile/profile";
import CateringMenu from "./components/cateringmenu/menu";

const Caterers = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedOrderCaterer, setSelectedOrderCaterer] = useState({});

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <UserHome setSelectedOrderCaterer={setSelectedOrderCaterer} setActiveTab={setActiveTab} />;
      case "cart":
        return <UserCart />;
      case "orders":
        return <UserOrders />;
      case "profile":
        return <UserProfile />;
      case "menu":
        return <CateringMenu />
      default:
        return null;
    }
  };

  const links = [
    { name: "Home",route: '#', tab: "home", icon: <FaHome /> },
    { name: "Cart",route: '#', tab: "cart", icon: <FaShoppingCart /> },
    { name: "Orders",route: '#', tab: "orders", icon: <FaClipboardList /> },
    { name: "Profile",route: '#', tab: "profile", icon: <FaUser /> },
    { name: "Logout", route: "/", icon: <FaSignOutAlt /> }
  ];

  return (
    <>
      <div className="relative w-full">
        {(activeTab == "home" || activeTab == "menu") &&  (
          <div className="relative w-full h-[400px]">
            <motion.div
              className="absolute inset-0 bg-fixed bg-center bg-cover bg-no-repeat z-0"
              style={{ backgroundImage: `url(${explorepageimage.src})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            />

            <div className="absolute bottom-0 w-full h-16 z-10 pointer-events-none">
              <svg
                className="absolute bottom-0 w-full"
                viewBox="0 0 1440 60"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="white"
                  d="M0,0 L100,15 L200,5 L300,35 L400,10 L500,30 L600,0 L700,25 L800,10 L900,20 L1000,15 L1100,30 L1200,5 L1300,25 L1400,0 L1440,10 L1440,60 L0,60 Z"
                />
              </svg>
            </div>

            <motion.div
              className="absolute top-1/2 left-6 md:left-12 lg:left-20 transform -translate-y-1/2 text-white z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {selectedOrderCaterer && selectedOrderCaterer.name ? (
                <h2 className="text-xl md:text-3xl lg:text-5xl font-bold">
                  Explore catering from {selectedOrderCaterer.name}
                </h2>
              ) : (
                <h2 className="text-xl md:text-3xl lg:text-5xl font-bold">
                  Explore the Caterers We Offer
                </h2>
              )}
              <p className="mt-2 text-sm md:text-lg lg:text-xl">
                Find the perfect caterer for your next event!
              </p>
            </motion.div>

          </div>
        )}

        <Header links={links} setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>

      <div className="h-screen">
        <div className={`flex h-full ${(activeTab != "home" && activeTab != "menu") ? 'pt-[130px] bg-gray-100': null}`}>
          {/* Main Content */}
          <main className={`flex-1 ${(activeTab != "home" && activeTab != "menu") ? 'p-8 overflow-y-auto custom-scrollbar':null}`}>
            {renderContent()}
          </main>
        </div>
      </div>
      
    </>
  );
};

export default Caterers;
