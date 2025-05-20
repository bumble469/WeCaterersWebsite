'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import loadingicon from "../../../assets/images/loadingicon.json";

const CatererDashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterOrderId, setFilterOrderId] = useState('');
  const [filterClientName, setFilterClientName] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const groupOrdersById = (flatOrders) => {
    const grouped = {};

    flatOrders.forEach((item) => {
      if (!grouped[item.orderid]) {
        grouped[item.orderid] = {
          orderid: item.orderid,
          clientname: item.clientname,
          email: item.email,            
          contact: item.contact,        
          servicename: item.servicename,
          order_date: item.order_date,
          address: item.address,
          status: item.status,
          notes: item.notes,
          total_price: item.total_price,
          items: [],
        };
      }

      grouped[item.orderid].items.push({
        menuname: item.menuname,
        servicename: item.servicename,
        quantity: item.quantity,
        menuprice: item.menuprice,
        serviceprice: item.serviceprice,
      });
    });

    return Object.values(grouped);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/caterer/orders', { withCredentials: true });
      if (response.status === 200) {
        const groupedOrders = groupOrdersById(response.data);
        setOrders(groupedOrders);
      } else {
        toast.error('Failed to fetch orders.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const refreshRes = await axios.post('/api/auth/caterer/refreshtoken', {}, {
            withCredentials: true,
          });

          if (refreshRes.status === 200) {
            return fetchOrders();
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr.message);
        }
      }
      toast.error('Error fetching orders. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOrderUpdate = (orderid, newStatus) => async () => {
    try {
      const response = await axios.put(
        '/api/caterer/orders',
        { orderid, status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(`Order #${orderid} updated to ${newStatus}`);
        fetchOrders();
      } else {
        toast.error('Failed to update order.');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          const refreshRes = await axios.post('/api/auth/caterer/refreshtoken', {}, {
            withCredentials: true,
          });

          if (refreshRes.status === 200) {
            return fetchOrders();
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr.message);
        }
      }
      toast.error('Error updating order. Please try again.');
      console.error(err);
    }
  };

  const formatDateTime = (isoDateTime) => {
    const date = new Date(isoDateTime);
    return date.toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesOrderId = filterOrderId
      ? order.orderid.toString().includes(filterOrderId.trim())
      : true;

    const matchesClientName = filterClientName
      ? order.clientname.toLowerCase().includes(filterClientName.trim().toLowerCase())
      : true;

    const matchesDate = filterDate
      ? new Date(order.order_date).toISOString().slice(0, 10) === filterDate
      : true;

    const matchesStatus = filterStatus
      ? order.status === filterStatus
      : true;

    return matchesOrderId && matchesClientName && matchesDate && matchesStatus;
  });
  const sortedFilteredOrders = filteredOrders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Lottie animationData={loadingicon} loop={true} style={{ height: 50 }} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 mb-4 md:mb-0"
            >
              <h2 className="text-2xl font-semibold text-gray-800">Catering Orders</h2>
              <p className="text-sm text-gray-500">
                Track and manage all your upcoming and past orders here.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row flex-wrap sm:justify-end gap-3 text-gray-600">
              <div className="flex flex-col text-xs w-full sm:w-[8rem]">
                <label className="font-semibold mb-1" htmlFor="filterOrderId">
                  Order ID
                </label>
                <input
                  type="text"
                  id="filterOrderId"
                  value={filterOrderId}
                  onChange={(e) => setFilterOrderId(e.target.value)}
                  placeholder="Search"
                  className="border rounded px-2 py-1 text-gray-800"
                />
              </div>

              <div className="flex flex-col text-xs w-full sm:w-[10rem]">
                <label className="font-semibold mb-1" htmlFor="filterClientName">
                  Client Name
                </label>
                <input
                  type="text"
                  id="filterClientName"
                  value={filterClientName}
                  onChange={(e) => setFilterClientName(e.target.value)}
                  placeholder="Search"
                  className="border rounded px-2 py-1 text-gray-800"
                />
              </div>

              <div className="flex flex-col text-xs w-full sm:w-[8.5rem]">
                <label className="font-semibold mb-1" htmlFor="filterDate">
                  Date
                </label>
                <input
                  type="date"
                  id="filterDate"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border rounded px-2 py-1 text-gray-800"
                />
              </div>

              <div className="flex flex-col text-xs w-full sm:w-[9rem]">
                <label className="font-semibold mb-1" htmlFor="filterStatus">
                  Status
                </label>
                <select
                  id="filterStatus"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-gray-800"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Requested Cancel">Requested Cancel</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setFilterOrderId('');
                  setFilterClientName('');
                  setFilterDate('');
                  setFilterStatus('');
                }}
                className="text-xs text-red-600 cursor-pointer mt-4 underline self-end sm:self-auto pb-1"
              >
                Clear
              </button>
            </div>

          </div>

          <div className="overflow-x-auto custom-scrollbar">
            {sortedFilteredOrders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
              >
                {sortedFilteredOrders.map((order, index) => (
                  <motion.div
                    key={order.orderid}
                    className="mb-8 border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {/* Order Header */}
                    <div className="flex items-center gap-x-2 m-2">
                      <h3 className="text-gray-500 font-bold m-0">Order #{order.orderid}</h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : ['Confirmed', 'Cancellation Rejected'].includes(order.status)
                            ? 'bg-green-100 text-green-700'
                            : ['Rejected', 'Cancelled', 'Cancelled_C'].includes(order.status)
                            ? 'bg-red-100 text-red-700'
                            : order.status === 'Requested Cancel'
                            ? 'bg-blue-100 text-blue-700'
                            : order.status === "Out for delivery"
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                        style={{ lineHeight: '1' }}
                      >
                        {order.status === 'Cancellation Rejected' ? 'Confirmed(cancellation confirmed)' : order.status}
                      </span>
                      {(order.status === "Confirmed" || order.status === "Cancellation Rejected") ? (
                        <button onClick={handleOrderUpdate(order.orderid, 'Out for delivery')} className='px-2 ml-auto hover:bg-blue-300 transition duration-100 cursor-pointer text-xs py-1 rounded-sm text-xs font-semibold bg-blue-200 text-blue-800'>
                          Mark as Out for Delivery
                        </button>
                      ) : null}
                    </div>


                    {/* Order Details */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-4">
                      {/* Client Info */}
                      <div className="w-full md:w-1/2 max-h-60 overflow-y-auto overflow-x-auto border border-gray-200 rounded-md">
                        <table className="w-full text-xs">
                          <tbody>
                            {[
                              { label: 'Client', value: order.clientname || '-' },
                              { label: 'Email', value: order.email || '-' },
                              { label: 'Contact', value: order.contact || '-' },
                              { label: 'Event', value: order.servicename || 'No occasion' },
                              { label: 'Ordered at', value: formatDateTime(order.order_date) },
                              { label: 'Address', value: order.address || '-' },
                            ].map((row, idx) => (
                              <tr key={row.label} className={idx % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="px-2 py-1 font-semibold text-gray-700 border border-gray-300 w-1/3">
                                  {row.label}:
                                </td>
                                <td className="px-4 py-2 text-gray-800 border border-gray-300">
                                  {row.label === 'Email' && row.value !== '-' ? (
                                    <a href={`mailto:${row.value}`} className="text-blue-600 hover:underline">
                                      {row.value}
                                    </a>
                                  ) : (
                                    row.value
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Menu Info */}
                      <div className="w-full text-gray-500 md:w-1/2 max-h-60 overflow-y-auto overflow-x-auto border border-gray-200 rounded-md">
                        <table className="w-full text-xs">
                          <thead>
                            <tr>
                              <th className="text-left px-2 py-1 font-semibold border border-gray-300">Menu</th>
                              <th className="text-left px-2 py-1 font-semibold border border-gray-300">Quantity</th>
                              <th className="text-left px-2 py-1 font-semibold border border-gray-300">Price</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm">
                            {order.items.map((item, i) => (
                              <tr key={i} className={i % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                <td className="px-4 py-2 border border-gray-300">
                                  {item.menuname ? item.menuname : item.servicename}
                                </td>
                                <td className="px-4 py-2 border border-gray-300">{item.quantity}</td>
                                <td className="px-4 py-2 border border-gray-300">
                                  ₹
                                  {item.menuname
                                    ? item.menuprice * item.quantity
                                    : item.serviceprice}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-200 font-semibold">
                              <td colSpan={2} className="px-2 py-1 text-right border border-gray-300">
                                Total Price
                              </td>
                              <td className="px-2 py-1 border border-gray-300">₹{order.total_price}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>

                    {/* Notes */}
                    <p className="mb-4 text-gray-600 font-semibold">Notes: {order.notes || 'None'}</p>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                      {order.status === 'Pending' && (
                        <>
                          <button
                            onClick={handleOrderUpdate(order.orderid, 'Confirmed')}
                            className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={handleOrderUpdate(order.orderid, 'Rejected')}
                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {order.status === 'Requested Cancel' && (
                        <>
                          <button
                            onClick={handleOrderUpdate(order.orderid, 'Cancelled')}
                              className='px-4 py-2 text-gray-600 bg-gray-200 cursor-pointer transition duration-100 hover:bg-gray-300 rounded-full text-xs font-semibold'
                          >
                            Accept Cancellation
                          </button>
                          <button
                            onClick={handleOrderUpdate(order.orderid, 'Cancellation Rejected')}
                            className='px-4 py-2 text-gray-600 bg-green-200 cursor-pointer transition duration-100 hover:bg-gray-300 rounded-full text-xs font-semibold'
                          >
                            Reject Cancellation
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );

};

export default CatererDashboardOrders;
