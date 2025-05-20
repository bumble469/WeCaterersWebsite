'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Briefcase, Utensils, DollarSign } from 'lucide-react';
import Lottie from 'lottie-react';
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
      className="bg-white rounded-lg shadow-md p-6 space-y-4"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      {!data ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Lottie animationData={loadingicon} loop={true} style={{ height: 50 }} />
        </div>
      ):(
        <>
          <motion.div 
            className="flex items-center border-b border-gray-200 pb-4"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <img src={data.cateringimage || '/placeholder.jpg'} alt="Caterer Profile" className="w-full h-full object-cover" />
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-800">{data.cateringname}</h3>
              <p className="text-sm text-gray-500 mt-1">{data.description}</p>
            </div>
          </motion.div>

          {/* Total Services */}
          <motion.div 
            className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Briefcase className="w-6 h-6 text-blue-600 mr-3" />
            <div>
              <h4 className="text-base font-semibold text-gray-800">Total Services</h4>
              <p className="text-sm text-gray-600 mt-1">{data.serviceCount} Services Offered</p>
            </div>
          </motion.div>

          {/* Total Menu Items */}
          <motion.div 
            className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center"
            variants={fadeInUp}
            transition={{ delay: 0.25 }}
          >
            <Utensils className="w-6 h-6 text-green-600 mr-3" />
            <div>
              <h4 className="text-base font-semibold text-gray-800">Total Menu Items</h4>
              <p className="text-sm text-gray-600 mt-1">{data.menuItemCount} Items Available</p>
            </div>
          </motion.div>

          {/* Total Earnings */}
          <motion.div 
            className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-center"
            variants={fadeInUp}
            transition={{ delay: 0.3 }}
          >
            <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
            <div>
              <h4 className="text-base font-semibold text-gray-800">Total Earnings</h4>
              <p className="text-lg text-gray-800 mt-1">${data.totalEarnings || 0}</p>
            </div>
          </motion.div>
        </>
      )}
    </motion.section>
  );
};

export default CatererDashboardOverview;
