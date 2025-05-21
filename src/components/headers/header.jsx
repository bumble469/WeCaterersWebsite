'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import logo from '@/assets/images/logo1.png';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const Header = ({ links, setActiveTab, activeTab, cartContains, pendingOrders }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutType, setLogoutType] = useState(null);
  const router = useRouter();

  const handleLogout = async (type) => {
    setShowLogoutConfirm(false);

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const logoutUrl = 
      type === "user" ? '/api/auth/user/logout' : 
      type === "admin" ? '/api/auth/admin/logout' : 
      '/api/auth/caterer/logout';

    const refreshUrl = 
      type === "user" ? '/api/auth/user/refreshtoken' : 
      type === "admin" ? '/api/auth/admin/refreshtoken' : 
      '/api/auth/caterer/refreshtoken';


    try {
      const response = await axios.post(logoutUrl, {}, { withCredentials: true });

      if (response.status === 200) {
        toast.success("Logout Success!", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        await delay(1000);
        router.push('/');
        return;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const refreshResponse = await axios.post(refreshUrl, {}, { withCredentials: true });

          if (refreshResponse.status === 200) {
            const retryResponse = await axios.post(logoutUrl, {}, { withCredentials: true });

            if (retryResponse.status === 200) {
              toast.success("Logout Success!", {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
              });
              await delay(1000);
              router.push('/');
              return;
            }
          }
        } catch (refreshErr) {
          console.log("Token refresh failed:", refreshErr.message);
        }
      }
      console.log("logout failed!", err.message);
      toast.error("Logout failed!", {
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };

  const confirmLogout = (type) => {
    setLogoutType(type);
    setShowLogoutConfirm(true);
  };

  return (
    <>
      <motion.div
        className='flex absolute items-center top-6 right-5 left-5 md:top-10 md:right-20 md:left-20 h-16'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className='flex h-15 md:h-20 w-auto bg-white rounded-xl items-center px-1 transform transition-all duration-300 ease-in-out shadow-md hover:shadow-lg'
          transition={{ duration: 0.3 }}
        >
          <Link href="/">
            <Image
              src={logo}
              className="h-28 md:h-34 w-auto cursor-pointer transition-all duration-300 ease-in-out transform"
              alt="Logo"
            />
          </Link>
        </motion.div>

        <motion.div
          className="bg-white rounded-r-full flex items-center gap-x-12 px-4 w-full h-[75%] transform transition-all duration-300 ease-in-out shadow-md hover:shadow-lg overflow-x-auto sm:overflow-x-auto"
          transition={{ duration: 0.3 }}
        >
          <nav className="flex text-xs md:text-[1.2vw] text-gray-700 gap-x-6 h-full items-center">
            {links.map((link, index) => {
              const isActive = activeTab && link.tab === activeTab;
              const showCartDot = link.tab === "cart" && cartContains;
              const showOrdersDot = link.tab === "orders" && pendingOrders > 0;
              return (
                <Link
                  href={link.route}
                  key={index}
                  onClick={(e) => {
                    if (link.name === "Logout") {
                      e.preventDefault();  
                      confirmLogout(link.type); 
                      return;
                    }
                    if (setActiveTab && link.tab) {
                      setActiveTab(link.tab);
                    }
                  }}
                  className={`relative h-full flex items-center gap-2 px-6 py-2 transition-all duration-300 ease-in-out ${
                    isActive ? 'bg-red-400 text-gray-100' : 'hover:bg-red-400 hover:text-gray-100'
                  }`}
                >
                  {link.icon && <span className="text-lg">{link.icon}</span>}
                  <span>{link.name}</span>
                  {showOrdersDot && (
                    <span className="absolute top-2 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                  {showCartDot && (
                    <span className="absolute top-2 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </motion.div>
      </motion.div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-black/30 z-900 flex items-center justify-center pointer-events-auto">
          <motion.div
            className="bg-white rounded-lg shadow-lg p-6 w-72 max-w-full mx-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <p className="mb-6 text-gray-600">Are you sure you want to logout?</p>
            <div className="flex justify-around">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 cursor-pointer text-gray-600 rounded bg-gray-300 hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleLogout(logoutType)}
                className="px-4 py-2 cursor-pointer text-gray-100 rounded bg-red-500 hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>

      )}
    </>
  );
};

export default Header;
