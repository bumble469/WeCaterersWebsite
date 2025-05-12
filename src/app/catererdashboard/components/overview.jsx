'use client';

import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const CatererDashboardOverview = () => {
  return (
    <motion.section 
      className="bg-white rounded-lg shadow-md p-6"
      initial="initial"
      animate="animate"
      variants={fadeInUp}
    >
      <motion.h2 
        className="text-2xl font-semibold text-gray-800 mb-2"
        variants={fadeInUp}
        transition={{ delay: 0.1 }}
      >
        Dashboard Overview
      </motion.h2>

      <motion.p 
        className="text-gray-600 text-sm mb-4"
        variants={fadeInUp}
        transition={{ delay: 0.15 }}
      >
        Welcome to your dashboard! Monitor and manage your catering business, including orders and services.
      </motion.p>

      {/* Profile */}
      <motion.div 
        className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4"
        variants={fadeInUp}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200">
            <img src="/path/to/profile-icon.jpg" alt="Caterer Profile" className="w-full h-full object-cover" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-semibold">Caterer Name</h3>
            <p className="text-xs text-gray-500">Active</p>
          </div>
        </div>
      </motion.div>

      {/* Services */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          { title: 'Total Services', subtitle: '4 Services Offered' },
          { title: 'Available Services', subtitle: '3 Services Available' },
        ].map((item, i) => (
          <motion.div 
            key={item.title}
            className="bg-gray-50 p-4 rounded-lg shadow-sm"
            variants={fadeInUp}
            transition={{ delay: 0.25 + i * 0.05 }}
          >
            <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{item.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* Events */}
      <motion.div 
        className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
        variants={fadeInUp}
        transition={{ delay: 0.35 }}
      >
        <h4 className="text-base font-semibold text-gray-800">Upcoming Events</h4>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>Wedding Reception - May 15, 2025 • 100 guests</li>
          <li>Corporate Lunch - May 20, 2025 • 50 guests</li>
        </ul>
      </motion.div>

      {/* Revenue */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {[
          { title: 'Total Earnings', value: '$15,000' },
          { title: 'Upcoming Payments', value: '$2,000' },
        ].map((item, i) => (
          <motion.div 
            key={item.title}
            className="bg-gray-50 p-4 rounded-lg shadow-sm"
            variants={fadeInUp}
            transition={{ delay: 0.4 + i * 0.05 }}
          >
            <h4 className="text-base font-semibold text-gray-800">{item.title}</h4>
            <p className="text-lg text-gray-800 mt-1">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity */}
      <motion.div 
        className="bg-gray-50 p-4 rounded-lg shadow-sm"
        variants={fadeInUp}
        transition={{ delay: 0.5 }}
      >
        <h4 className="text-base font-semibold text-gray-800">Recent Activity</h4>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>New booking for Wedding Reception – May 15, 2025</li>
          <li>Service “Buffet Setup” price updated</li>
        </ul>
      </motion.div>
    </motion.section>
  );
};

export default CatererDashboardOverview;
