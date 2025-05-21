'use client';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
  Delivered: 'bg-green-100 text-green-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Cancelled: 'bg-red-100 text-red-800',
  Rejected: 'bg-gray-100 text-gray-800',
};

const statuses = ['Pending', 'Delivered', 'Cancelled', 'Rejected'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
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

  const mapApiOrderToFrontend = (apiOrder) => ({
    id: `ORD-${apiOrder.orderid}`,
    user: apiOrder.username,
    caterer: apiOrder.cateringname,
    date: apiOrder.order_date.split('T')[0], // e.g. "2025-05-21"
    status: apiOrder.status,
    total: parseFloat(apiOrder.total_price),
    items: apiOrder.items.map((item) => ({
      id: item.itemid,
      name: item.name,
      quantity: item.quantity,
      price: item.price || 0,
    })),
    });

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders', { withCredentials: true });
      setOrders(response.data.map(mapApiOrderToFrontend));
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.post('/api/auth/admin/refreshtoken', {}, { withCredentials: true });
          const retryResponse = await axios.get('/api/admin/orders', { withCredentials: true });
          setOrders(retryResponse.data.map(mapApiOrderToFrontend));
        } catch (refreshError) {
          console.error('Refresh token failed, please login again.');
        }
      } else {
        console.error('Failed to fetch orders:', error);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filterDate && order.date !== filterDate) return false;
      if (filterStatus.size > 0 && !filterStatus.has(order.status)) return false;
      return true;
    });
  }, [filterDate, filterStatus, orders]);

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
                    <span className="text-gray-700">{status}</span>
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

      <div className="mt-10">
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500">No orders match the selected filters.</p>
        ) : (
          filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-6 border rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => toggleExpand(order.id)}
            >
              {/* Order Summary Table */}
              <table className="w-full text-left table-fixed border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 font-semibold text-blue-800 w-1/4">Order ID</th>
                    <th className="p-4 font-semibold text-gray-500 w-1/4">User</th>
                    <th className="p-4 font-semibold text-gray-500 w-1/4">Caterer</th>
                    <th className="p-4 font-semibold text-gray-500 w-1/5">Date</th>
                    <th className="p-4 font-semibold text-gray-500 w-1/5">Status</th>
                    <th className="p-4 font-semibold text-gray-500 w-1/6 text-right">Total ($)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white hover:bg-blue-50 transition-colors">
                    <td className="p-4 font-semibold text-blue-700">{order.id}</td>
                    <td className="p-4 text-gray-500">{order.user}</td>
                    <td className="p-4 text-gray-500">{order.caterer}</td>
                    <td className="p-4 text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="p-4 text-gray-500">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          statusColors[order.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-right text-gray-500">&#8377;{order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              {/* Expandable Order Items */}
              <AnimatePresence>
                {expandedOrder === order.id && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-5 pb-4 border-t bg-gray-50"
                  >
                    <h3 className="font-semibold mb-3 text-gray-800 mt-4">Order Items</h3>
                    <table className="w-full text-left table-fixed border-collapse shadow-sm">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="p-3 font-medium text-gray-700 w-1/6">Item ID</th>
                          <th className="p-3 font-medium text-gray-700 w-3/6">Name</th>
                          <th className="p-3 font-medium text-gray-700 w-1/6 text-center">Quantity</th>
                          <th className="p-3 font-medium text-gray-700 w-1/6 text-right">Price ($)</th>
                          <th className="p-3 font-medium text-gray-700 w-1/6 text-right">Total ($)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr
                            key={i}
                            className={i % 2 === 0 ? 'bg-white' : 'bg-gray-100'}
                          >
                            <td className="p-3 text-gray-500">{item.id || 'N/A'}</td>
                            <td className="p-3 text-gray-500">{item.name}</td>
                            <td className="p-3 text-center text-gray-500">{item.quantity}</td>
                            <td className="p-3 text-right text-gray-500">{item.price.toFixed(2)}</td>
                            <td className="p-3 text-right text-gray-500">{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminOrders;
