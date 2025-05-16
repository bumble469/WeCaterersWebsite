'use client';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sampleOrders = [
  {
    id: 'ORD-1001',
    user: 'Alice Johnson',
    caterer: 'Delicious Bites',
    date: '2025-05-10',
    status: 'Completed',
    total: 120.5,
    items: [
      { name: 'Veg Sandwich', quantity: 2, price: 5.0 },
      { name: 'Fruit Salad', quantity: 1, price: 7.5 },
    ],
  },
  {
    id: 'ORD-1002',
    user: 'Bob Smith',
    caterer: 'Tasty Treats',
    date: '2025-05-11',
    status: 'Pending',
    total: 89.0,
    items: [
      { name: 'Chicken Wrap', quantity: 3, price: 8.0 },
      { name: 'Lemonade', quantity: 3, price: 3.0 },
    ],
  },
  {
    id: 'ORD-1003',
    user: 'Clara Lee',
    caterer: 'Gourmet Feast',
    date: '2025-05-09',
    status: 'Cancelled',
    total: 45.0,
    items: [
      { name: 'Pasta', quantity: 1, price: 12.0 },
      { name: 'Garlic Bread', quantity: 1, price: 5.0 },
    ],
  },
];

const statusColors = {
  Completed: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const statuses = ['Pending', 'Completed', 'Cancelled'];

const AdminOrders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  const toggleStatus = (status) => {
    const newSet = new Set(filterStatus);
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    setFilterStatus(newSet);
  };

  const filteredOrders = useMemo(() => {
    return sampleOrders.filter((order) => {
      // Filter by date if set
      if (filterDate) {
        if (order.date !== filterDate) return false;
      }
      // Filter by status if any status selected
      if (filterStatus.size > 0 && !filterStatus.has(order.status)) {
        return false;
      }
      return true;
    });
  }, [filterDate, filterStatus]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Orders</h2>

      {/* Filter Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none cursor-pointer"
          aria-expanded={filterOpen}
          aria-controls="filter-menu"
        >
          Filter
        </button>

        <AnimatePresence>
          {filterOpen && (
            <motion.div
              id="filter-menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 p-4 z-10"
            >
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-1" htmlFor="filter-date">
                  Date
                </label>
                <input
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 text-gray-700"
                />
              </div>

              <div>
                <p className="text-gray-700 font-semibold mb-2">Status</p>
                {statuses.map((status) => (
                  <label key={status} className="flex items-center space-x-2 mb-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterStatus.has(status)}
                      onChange={() => toggleStatus(status)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span className='text-gray-700'>{status}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => {
                  setFilterDate('');
                  setFilterStatus(new Set());
                }}
                className="mt-4 w-full py-2 text-sm text-red-600 hover:underline"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      <div className="space-y-4 mt-10">
        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-500">No orders match the selected filters.</p>
        )}

        {filteredOrders.map((order) => (
          <motion.div
            key={order.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toggleExpand(order.id)}
          >
            {/* Order Summary */}
            <div className="flex justify-between items-center px-5 py-4">
              <div className="flex flex-col space-y-1">
                <p className="font-semibold text-lg text-blue-700">{order.id}</p>
                <p className="text-gray-700">
                  User: <span className="font-medium">{order.user}</span>
                </p>
                <p className="text-gray-700">
                  Caterer: <span className="font-medium">{order.caterer}</span>
                </p>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <p className="text-gray-600">{new Date(order.date).toLocaleDateString()}</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    statusColors[order.status] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {order.status}
                </span>
                <p className="text-gray-900 font-semibold">${order.total.toFixed(2)}</p>
              </div>
            </div>

            {/* Expandable Details */}
            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-5 pb-4 border-t"
                >
                  <h3 className="font-semibold mb-2 text-gray-800">Order Items</h3>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="flex justify-between text-gray-700">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
