'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const CatererDashboardOrders = () => {
  const [orders] = useState([
    {
      id: 'ORD001',
      client: 'John Doe',
      event: 'Wedding Reception',
      date: '2025-05-20T18:00',
      guests: 120,
      address: '123 Wedding St, Springfield',
      status: 'Confirmed',
    },
    {
      id: 'ORD002',
      client: 'Jane Smith',
      event: 'Corporate Lunch',
      date: '2025-05-25T12:30',
      guests: 45,
      address: '456 Business Ave, Metropolis',
      status: 'Pending',
    },
    {
      id: 'ORD003',
      client: 'Mike Johnson',
      event: 'Birthday Party',
      date: '2025-06-01T15:00',
      guests: 60,
      address: '789 Celebration Rd, Gotham',
      status: 'Completed',
    },
  ]);

  const formatDateTime = (isoDateTime) => {
    const date = new Date(isoDateTime);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800">Catering Orders</h2>
        <p className="text-sm text-gray-500">
          Track and manage all your upcoming and past orders here.
        </p>
      </motion.div>

      <div className="overflow-x-auto">
        <motion.table
          className="min-w-full table-auto border-collapse"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
              <th className="px-4 py-3 border-b">Order ID</th>
              <th className="px-4 py-3 border-b">Client</th>
              <th className="px-4 py-3 border-b">Event</th>
              <th className="px-4 py-3 border-b">Date & Time</th>
              <th className="px-4 py-3 border-b">Guests</th>
              <th className="px-4 py-3 border-b">Address</th>
              <th className="px-4 py-3 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <motion.tr
                key={order.id}
                className="hover:bg-gray-50 text-sm"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <td className="px-4 py-3 border-b border-gray-300 font-medium text-gray-800">{order.id}</td>
                <td className="px-4 py-3 border-b border-gray-300 text-gray-600">{order.client}</td>
                <td className="px-4 py-3 border-b border-gray-300 text-gray-600">{order.event}</td>
                <td className="px-4 py-3 border-b border-gray-300 text-gray-600">{formatDateTime(order.date)}</td>
                <td className="px-4 py-3 border-b border-gray-300 text-gray-600">{order.guests}</td>
                <td className="px-4 py-3 border-b border-gray-300 text-gray-600">{order.address}</td>
                <td className="px-4 py-3 border-b border-gray-300 text-gray-600">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Confirmed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </motion.div>
  );
};

export default CatererDashboardOrders;
