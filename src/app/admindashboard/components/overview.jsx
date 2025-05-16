'use client';
import { FaUsers, FaConciergeBell, FaShoppingCart, FaChartLine } from 'react-icons/fa';
import { motion } from 'framer-motion';

const stats = [
  {
    name: 'Total Users',
    count: 1200,
    icon: <FaUsers className="text-blue-500 text-3xl" />,
  },
  {
    name: 'Total Caterers',
    count: 250,
    icon: <FaConciergeBell className="text-green-500 text-3xl" />,
  },
  {
    name: 'Total Orders',
    count: 5400,
    icon: <FaShoppingCart className="text-orange-500 text-3xl" />,
  },
  {
    name: 'Monthly Revenue',
    count: '₹8.5L',
    icon: <FaChartLine className="text-purple-500 text-3xl" />,
  },
];

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
