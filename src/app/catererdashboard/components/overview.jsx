'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Briefcase, Utensils, DollarSign, CheckCircle, XCircle, Package } from 'lucide-react';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingicon from "../../../assets/images/loadingicon.json";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const CatererDashboardOverview = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await axios.get('/api/caterer/overview', {
          withCredentials: true,
        });
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          try {
            const refreshRes = await axios.post('/api/auth/caterer/refreshtoken', {}, {
              withCredentials: true,
            });

            if (refreshRes.status === 200) {
              const retryRes = await axios.get('/api/caterer/overview', {
                withCredentials: true,
              });
              setData(retryRes.data);
              return;
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr.message);
          }
        }
        console.error('Failed to fetch caterer overview:', err.message);
      }
    };

    fetchOverview();
  }, []);

  return (
    <motion.section 
      className="bg-white rounded-lg shadow-md p-6"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {!data ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Lottie animationData={loadingicon} loop={true} style={{ height: 60 }} />
        </div>
      ) : (
        <>
          {/* Profile & Description */}
          <motion.div 
            className="flex items-center justify-between gap-6 border-b border-gray-200 pb-6 mb-8"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            {/* Left: Profile Image + Info */}
            <div className="flex items-center gap-6 flex-1 min-w-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={data.cateringimage} 
                  alt="Caterer Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="truncate">
                <h2 className="text-2xl font-semibold text-gray-900 truncate">{data.cateringname}</h2>
                <p className="text-gray-600 mt-1 max-w-xl truncate">{data.description}</p>
              </div>
            </div>

            {/* Right: Overall Rating */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="text-right">
                <h3 className="text-xl font-semibold text-gray-900">Overall Rating</h3>
                <p className="text-gray-600 text-lg mt-1">
                  <span className="text-3xl select-none">⭐ {data.rating != null ? `${data.rating} / 5` : 'No ratings yet'}</span>
                </p>
              </div>
            </div>
          </motion.div>


          {/* Business Summary */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10"
            variants={fadeInUp}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-center gap-4">
              <Briefcase className="w-7 h-7 text-indigo-600" />
              <div>
                <p className="text-gray-700 font-medium">Services Offered</p>
                <p className="text-gray-500 text-sm">{data.serviceCount} Services</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Utensils className="w-7 h-7 text-green-600" />
              <div>
                <p className="text-gray-700 font-medium">Menu Items</p>
                <p className="text-gray-500 text-sm">{data.menuItemCount} Items</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <DollarSign className="w-7 h-7 text-yellow-600" />
              <div>
                <p className="text-gray-700 font-medium">Services Delivered</p>
                <p className="text-gray-500 text-sm">{data.servicesDelivered}</p>
              </div>
            </div>
          </motion.div>

          {/* Order Statistics */}
          <motion.div
            className="mb-10"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="p-4 border rounded-md shadow-sm">
                <DollarSign className="w-6 h-6 text-yellow-600 mb-2" />
                <p className="text-gray-700 font-medium">Orders Received</p>
                <p className="text-gray-500 text-lg">{data.ordersReceived}</p>
              </div>

              <div className="p-4 border rounded-md shadow-sm">
                <CheckCircle className="w-6 h-6 text-blue-600 mb-2" />
                <p className="text-gray-700 font-medium">Confirmed Orders</p>
                <p className="text-gray-500 text-lg">{data.confirmedOrders}</p>
              </div>

              <div className="p-4 border rounded-md shadow-sm">
                <Package className="w-6 h-6 text-green-600 mb-2" />
                <p className="text-gray-700 font-medium">Delivered Orders</p>
                <p className="text-gray-500 text-lg">{data.deliveredOrders}</p>
              </div>

              <div className="p-4 border rounded-md shadow-sm">
                <XCircle className="w-6 h-6 text-red-600 mb-2" />
                <p className="text-gray-700 font-medium">Cancelled Orders</p>
                <p className="text-gray-500 text-lg">{data.cancelledOrders}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
};

export default CatererDashboardOverview;
