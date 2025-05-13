'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const dummyOrders = [
  {
    id: 'ORD123456',
    date: '2025-05-10 12:30 PM',
    items: [
      { name: 'Paneer Butter Masala', quantity: 2, caterer: 'Tandoori Treats' },
      { name: 'Veg Biryani', quantity: 1, caterer: 'Spice Garden' },
    ],
    total: 510,
    status: 'Preparing',
    isPast: false,
  },
  {
    id: 'ORD123455',
    date: '2025-04-28 07:45 PM',
    items: [
      { name: 'Dal Makhani', quantity: 1, caterer: 'Punjabi Zaika' },
      { name: 'Tandoori Roti', quantity: 4, caterer: 'Punjabi Zaika' },
    ],
    total: 260,
    status: 'Delivered',
    isPast: true,
  },
  {
    id: 'ORD123457',
    date: '2025-04-27 09:15 AM',
    items: [
      { name: 'Chole Bhature', quantity: 1, caterer: 'Balle Balle' },
    ],
    total: 150,
    status: 'Cancelled',
    isPast: true,
  },
];

const UserOrders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [activeTab, setActiveTab] = useState('current');

  const currentOrders = orders.filter(order => !order.isPast);
  const pastOrders = orders.filter(order => order.isPast);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Preparing':
        return 'bg-blue-100 text-blue-700';  // Blue for Preparing
      case 'Cancelled':
        return 'bg-red-100 text-red-700';  // Red for Cancelled
      case 'Delivered':
        return 'bg-green-100 text-green-700';  // Green for Delivered
      default:
        return 'bg-gray-100 text-gray-700';  // Default grey
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 z-[50] relative">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Your Orders</h2>

      {/* Tabs for Current and Past Orders */}
      <div className="flex mb-6">
        <button
          className={`px-6 py-2 text-xl cursor-pointer font-semibold ${activeTab === 'current' ? 'text-blue-700 border-b-2 border-blue-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('current')}
        >
          Current Orders
        </button>
        <button
          className={`px-6 py-2 text-xl cursor-pointer font-semibold ${activeTab === 'past' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500'}`}
          onClick={() => setActiveTab('past')}
        >
          Past Orders
        </button>
      </div>

      {/* Current Orders Tab Content */}
      {activeTab === 'current' && (
        <div className="mb-10">
          {currentOrders.length === 0 ? (
            <p className="text-gray-500">You have no active orders.</p>
          ) : (
            currentOrders.map(order => (
              <motion.div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-lg text-gray-500 font-semibold">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.status)} font-medium`}>
                    {order.status}
                  </div>
                </div>
                <ul className="space-y-1 text-gray-700 mb-3">
                  {order.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * idx }}
                    >
                      {item.quantity}× {item.name} <span className="text-sm text-gray-500">from {item.caterer}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900">Total: ₹{order.total}</p>
                  <button className="text-red-600 hover:underline text-sm">Cancel Order</button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Past Orders Tab Content */}
      {activeTab === 'past' && (
        <div>
          {pastOrders.length === 0 ? (
            <p className="text-gray-500">No past orders available.</p>
          ) : (
            pastOrders.map(order => (
              <motion.div
                key={order.id}
                className="bg-white p-6 rounded-lg shadow mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="text-lg text-gray-500 font-semibold">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">{order.date}</p>
                  </div>
                  <div className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.status)} font-medium`}>
                    {order.status}
                  </div>
                </div>
                <ul className="space-y-1 text-gray-700 mb-3">
                  {order.items.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.1 * idx }}
                    >
                      {item.quantity}× {item.name} <span className="text-sm text-gray-500">from {item.caterer}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="text-gray-900 font-semibold">Total: ₹{order.total}</div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
