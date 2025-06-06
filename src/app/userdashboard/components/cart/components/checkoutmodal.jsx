import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserCheckout = ({ cart, setShowModal, total, handleCartFetch }) => {
  const [address, setAddress] = useState('');

  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [additionalPointers, setAdditionalPointers] = useState('');

  useEffect(() => {
    async function fetchAddress() {
      try {
        const res = await axios.post('/api/user/profile');
        if (res.data?.address) {
          setAddress(res.data.address);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            const refreshRes = await axios.post('/api/auth/caterer/refreshtoken', {}, {
              withCredentials: true,
            });

            if (refreshRes.status === 200) {
              const res = await axios.post('/api/user/profile');
              if (res.data?.address) {
                setAddress(res.data.address);
              }
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr.message);
          }
        }
        console.error('Failed to fetch address:', error);
        toast.error('Failed to fetch address');
      }
    }

    fetchAddress();
  }, []);

  const placeOrder = async () => {
    try {
      const cateringid = cart.length > 0 ? cart[0].cateringid : null;
      if (!cateringid) {
        toast.warn('No catering selected!');
        return;
      }

      // Combine inputs into notes string, without section
      const notes = `
        Deliver to: ${address}
        Time: ${time}
        Date: ${date}
        Additional Pointers: ${additionalPointers}
      `;

      const res = await axios.post('/api/user/orders', {
        cateringid,
        status: 'Pending',
        notes: notes.trim(),
        total_price: total,
      });

      if (res.status === 200) {
        toast.success('Order placed successfully!');
        handleCartFetch();
        setShowModal(false);
      } else {
        toast.error('Failed to place order: ' + (res.data?.error || 'Unknown error'));
      }
    } catch (error) {
      toast.error('Error placing order.');
      console.error(error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-50 pointer-events-auto" />

      <motion.div
        className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Checkout</h2>

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b py-3">
                <div>
                  <p className="text-lg font-medium text-gray-800">{item.name} x{item.quantity}</p>
                  <p className="text-sm text-gray-600">from {item.cateringname}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="mt-6">
            <h3 className="font-semibold mb-1 text-gray-600">Delivery Address</h3>
            <p className="text-gray-700">{address || 'Loading address...'}</p>
          </div>

          {/* New Inputs Section (without Section) */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="time">Enter Time</label>
              <input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border border-gray-300 text-gray-500 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 text-gray-500 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="additional">Additional Pointers</label>
              <input
                id="additional"
                type="text"
                placeholder="Any additional pointers"
                value={additionalPointers}
                onChange={(e) => setAdditionalPointers(e.target.value)}
                className="w-full border border-gray-300 text-gray-500 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Total Amount */}
          <div className="mt-6 flex justify-between font-semibold text-gray-900 border-t pt-4">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 space-x-4">
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gray-300 cursor-pointer text-gray-800 hover:bg-gray-400 py-3 rounded-lg transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={placeOrder}
              className="w-full cursor-pointer bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg transition duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default UserCheckout;
