'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingicon from "../../../../assets/images/loadingicon.json";
import { toast } from 'react-toastify';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/api/user/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const rawOrders = res.data;
        const grouped = {};

        rawOrders.forEach(item => {
          const {
            orderid, status, total_price, notes, order_date,
            cateringname, menuname, menuprice, quantity
          } = item;

          if (!grouped[orderid]) {
            grouped[orderid] = {
              id: `${orderid.toString()}`,
              date: new Date(order_date).toLocaleString(),
              items: [],
              total: parseFloat(total_price),
              status,
              isPast: ['Delivered', 'Cancelled', 'Rejected'].includes(status),
              notes,
            };
          }

          grouped[orderid].items.push({
            name: menuname || item.servicename || 'Unknown Item',
            quantity,
            caterer: cateringname || 'Unknown Caterer',
          });
        });

        setOrders(Object.values(grouped));
      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            const refreshRes = await axios.post('/api/auth/user/refreshtoken');
            const retryRes = await axios.get('/api/user/orders', {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });

            const rawOrders = retryRes.data;
            const grouped = {};

            rawOrders.forEach(item => {
              const {
                orderid, status, total_price, notes, order_date,
                cateringname, menuname, quantity
              } = item;

              if (!grouped[orderid]) {
                grouped[orderid] = {
                  id: `${orderid.toString()}`,
                  date: new Date(order_date).toLocaleString(),
                  items: [],
                  total: parseFloat(total_price),
                  status,
                  isPast: ['Delivered', 'Cancelled', 'Rejected'].includes(status),
                  notes,
                };
              }

              grouped[orderid].items.push({
                name: menuname || item.servicename || 'Unknown Item',
                quantity,
                caterer: cateringname || 'Unknown Caterer',
              });
            });

            setOrders(Object.values(grouped));
          } catch (refreshErr) {
            console.error('Token refresh failed:', refreshErr);
          }
        } else {
          console.error('Failed to fetch orders:', err);
        }
      }
      finally { 
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async () => {
    const toastOptions = {
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
    };

    try {
      const res = await axios.delete('/api/user/orders', {
        data: { orderid: orderToDelete },
        withCredentials: true,
      });

      if (res.status == 200) {
        setOrders(prev => prev.filter(order => order.id !== orderToDelete));
        setShowModal(false);
        setOrderToDelete(null);
        toast.info("Order deleted!", toastOptions);
      } else {
        toast.error("Error deleting order!", toastOptions);
      }

    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          await axios.post('/api/auth/user/refreshtoken', {}, { withCredentials: true });

          const retryRes = await axios.delete('/api/user/orders', {
            data: { orderid: orderToDelete },
            withCredentials: true,
          });

          if (retryRes.status === 200) {
            setOrders(prev => prev.filter(order => order.id !== orderToDelete));
            setShowModal(false);
            setOrderToDelete(null);
            toast.info("Order cancelled!", {
              autoClose: 1000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: false,
              draggable: false,
            });
            return;
          }
        } catch (refreshErr) {
          console.error("Token refresh or retry delete failed:", refreshErr);
        }
      }
      console.error("Delete failed:", err);
    }
  };

  const handleUpdateOrder = async (orderId, newstatus) => {
    const toastOptions = {
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    };

    try {
      const res = await axios.put('/api/user/orders', 
        { orderid: orderId, newStatus: newstatus },
        { withCredentials: true }
      );

      if (res.status === 200) {
        toast.info(`Status updated to ${newstatus}`, toastOptions);
        setOrders(prev =>
          prev.map(order => 
            order.id === orderId ? { ...order, status: newstatus } : order
          )
        );
      } else {
        toast.error("Failed to update status", toastOptions);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        try {
          await axios.post('/api/auth/user/refreshtoken', {}, { withCredentials: true });

          const retryRes = await axios.post('/api/user/orders/requestcancel',
            { orderid: orderId },
            { withCredentials: true }
          );

          if (retryRes.status === 200) {
            toast.info(`Status updated to ${newstatus}`, toastOptions);
            setOrders(prev =>
              prev.map(order => 
                order.id === orderId ? { ...order, status: newstatus } : order
              )
            );
            return;
          }
        } catch (refreshErr) {
          console.error("Token refresh or retry request cancel failed:", refreshErr);
        }
      }
      toast.error("Error updating request", toastOptions);
      console.error("Error updating request: ", err);
    }
  };

  const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
  const currentOrders = sortedOrders.filter(order => !order.isPast);
  const pastOrders = sortedOrders.filter(order => order.isPast);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-200 text-gray-600'
      case 'Cancellation Rejected':
        return 'bg-green-200 text-gray-600'
      case 'Pending':
        return 'bg-blue-100 text-blue-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Out for delivery':
        return 'bg-blue-200 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 z-[50] relative">
      {loading ? (
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Lottie
            animationData={loadingicon}
            loop={true}
            style={{ width: 50, height: 50 }}
          />
        </div>
      ):(
        <>
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Your Orders</h2>
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

          {(activeTab === 'current' ? currentOrders : pastOrders).length === 0 ? (
            <p className="text-gray-500">
              {activeTab === 'current' ? 'You have no active orders.' : 'No past orders available.'}
            </p>
          ) : (
            (activeTab === 'current' ? currentOrders : pastOrders).map(order => (
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
                  <div className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.status)} font-medium flex items-center gap-2`}>
                    {order.status == 'Cancellation Rejected' ? (
                      <>
                        <p className='font-bold'>Confirmed</p>
                        <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                          Cancellation Rejected
                        </span>
                      </>
                    ) : (
                      <>
                        <p className='font-bold'>{order.status}</p>
                        {order.status == "Rejected" && (<p className='text-xs'>Sorry! We were unable to take this order</p>)}
                      </>
                    )}
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
                  {!order.isPast && (
                    order.status === "Confirmed" ? (
                      <button
                        onClick={() => handleUpdateOrder(order.id,"Requested Cancel")}
                        className="text-red-600 cursor-pointer hover:underline text-sm"
                      >
                        Request Cancel
                      </button>
                    ) : order.status === "Pending" ? (
                      <button
                        onClick={() => {
                          setOrderToDelete(order.id);
                          setShowModal(true);
                        }}
                        className="text-red-600 cursor-pointer hover:underline text-sm"
                      >
                        Cancel Order
                      </button>
                    ) : order.status === "Out for delivery" ? (
                        <button
                          onClick={() => {
                            handleUpdateOrder(order.id, "Delivered");
                          }}
                          className="text-blue-600 cursor-pointer hover:underline text-sm"
                          >
                          Got it!
                      </button>
                    ) : null
                  )}
                </div>
              </motion.div>
            ))
          )}
        </>
      )}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-[2px] bg-opacity-40 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Are you sure you want to cancel this order?</h3>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-300 cursor-pointer text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => {
                  setShowModal(false);
                  setOrderToDelete(null);
                }}
              >
                No
              </button>
              <button
                className="bg-red-600 text-white cursor-pointer px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDeleteOrder}
              >
                Yes, Cancel
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrders;
