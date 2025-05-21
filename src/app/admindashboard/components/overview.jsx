'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers,
  FaConciergeBell,
  FaShoppingCart,
  FaClipboardCheck,
  FaTruck,
  FaTimesCircle,
  FaTools,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: 'spring', stiffness: 80, damping: 15 },
  }),
  hover: { scale: 1.05, boxShadow: '0px 8px 15px rgba(0,0,0,0.15)' },
};

const AdminOverview = () => {
  const [stats, setStats] = useState([
    { name: 'Total Users', count: '-', icon: <FaUsers className="text-blue-500 text-3xl" /> },
    { name: 'Total Caterers', count: '-', icon: <FaConciergeBell className="text-green-500 text-3xl" /> },
    { name: 'Orders Received', count: '-', icon: <FaShoppingCart className="text-orange-500 text-3xl" /> },
    { name: 'Confirmed Orders', count: '-', icon: <FaClipboardCheck className="text-teal-500 text-3xl" /> },
    { name: 'Delivered Orders', count: '-', icon: <FaTruck className="text-purple-500 text-3xl" /> },
    { name: 'Cancelled Orders', count: '-', icon: <FaTimesCircle className="text-red-500 text-3xl" /> },
    { name: 'Services Delivered', count: '-', icon: <FaTools className="text-indigo-500 text-3xl" /> },
  ]);

  const fetchOverview = async () => {
    try {
      const res = await axios.get('/api/admin/overview', { withCredentials: true });
      const data = res.data;
      setStats([
        { name: 'Total Users', count: data.totalUsers, icon: <FaUsers className="text-blue-500 text-3xl" /> },
        { name: 'Total Caterers', count: data.totalCaterers, icon: <FaConciergeBell className="text-green-500 text-3xl" /> },
        { name: 'Orders Received', count: data.ordersReceived, icon: <FaShoppingCart className="text-orange-500 text-3xl" /> },
        { name: 'Confirmed Orders', count: data.confirmedOrders, icon: <FaClipboardCheck className="text-teal-500 text-3xl" /> },
        { name: 'Delivered Orders', count: data.deliveredOrders, icon: <FaTruck className="text-purple-500 text-3xl" /> },
        { name: 'Cancelled Orders', count: data.cancelledOrders, icon: <FaTimesCircle className="text-red-500 text-3xl" /> },
        { name: 'Services Delivered', count: data.servicesDelivered, icon: <FaTools className="text-indigo-500 text-3xl" /> },
      ]);
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await axios.post('/api/auth/admin/refreshtoken', { withCredentials: true });
          const retryRes = await axios.get('/api/admin/overview', { withCredentials: true });
          const data = retryRes.data;
          setStats([
            { name: 'Total Users', count: data.totalUsers, icon: <FaUsers className="text-blue-500 text-3xl" /> },
            { name: 'Total Caterers', count: data.totalCaterers, icon: <FaConciergeBell className="text-green-500 text-3xl" /> },
            { name: 'Orders Received', count: data.ordersReceived, icon: <FaShoppingCart className="text-orange-500 text-3xl" /> },
            { name: 'Confirmed Orders', count: data.confirmedOrders, icon: <FaClipboardCheck className="text-teal-500 text-3xl" /> },
            { name: 'Delivered Orders', count: data.deliveredOrders, icon: <FaTruck className="text-purple-500 text-3xl" /> },
            { name: 'Cancelled Orders', count: data.cancelledOrders, icon: <FaTimesCircle className="text-red-500 text-3xl" /> },
            { name: 'Services Delivered', count: data.servicesDelivered, icon: <FaTools className="text-indigo-500 text-3xl" /> },
          ]);
        } catch {
          setStats(prev => prev); // or show some error
        }
      }
    }
  };

  React.useEffect(() => {
    fetchOverview();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 flex items-center space-x-4 cursor-pointer"
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={cardVariants}
          >
            <div className="p-3 bg-gray-100 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-gray-600 text-sm">{stat.name}</p>
              <p className="text-xl font-semibold text-gray-500">{stat.count}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOverview;
