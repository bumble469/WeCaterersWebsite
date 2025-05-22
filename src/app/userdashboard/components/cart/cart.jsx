'use client';
import { useState, useEffect } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserCheckout from './components/checkoutmodal';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingicon from '../../../../assets/images/loadingicon.json';
import axios from 'axios';
import { toast } from 'react-toastify';

const TAX_RATE = 0.05;

const UserCart = ({removeFromCart}) => {
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchCart() {
    try {
      let res = await axios.get('/api/user/cart', {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res.data;

      const transformed = data.map(item => {
        const isService = !item.menuid;
        return {
          cartid: item.cartid,
          cateringid: Number(item.cateringid),
          id: item.menuid ?? item.serviceid ?? Math.random(),
          name: item.menu_name || item.service_name || 'Unknown Item',
          cateringname: item.cateringname || 'Unknown Caterer',
          quantity: item.quantity,
          price: parseFloat(item.menu_price ?? item.service_price ?? 0),
          image: isService ? null : (item.image_data || '/default-image.png'),
          isService,
        };
      });

      setCart(transformed);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshRes = await axios.post('/api/auth/user/refreshtoken', {}, {
            withCredentials: true,
          });

          if (refreshRes.status === 200) {
            const retryRes = await axios.get('/api/user/cart', {
              withCredentials: true,
              headers: { 'Content-Type': 'application/json' },
            });

            const data = retryRes.data;

            const transformed = data.map(item => {
              const isService = !item.menuid;
              return {
                cartid: item.cartid,
                cateringid: Number(item.cateringid),
                id: item.menuid ?? item.serviceid ?? Math.random(),
                name: item.menu_name || item.service_name || 'Unknown Item',
                cateringname: item.cateringname || 'Unknown Caterer',
                quantity: item.quantity,
                price: parseFloat(item.menu_price ?? item.service_price ?? 0),
                image: isService ? null : (item.image_data || '/default-image.png'),
                isService,
              };
            });

            setCart(transformed);
          } else {
            throw new Error('Refresh token failed');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          setCart([]);
        }
      } else {
        console.error(error);
        setCart([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleCartFetch = () => {
    fetchCart();
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? (item.isService ? item : { ...item, quantity: Math.max(1, item.quantity + delta) })
          : item
      )
    );

    const itemToUpdate = cart.find(item => item.id === id);
    if (!itemToUpdate || itemToUpdate.isService) return;

    const newQuantity = Math.max(1, itemToUpdate.quantity + delta);

    try {
      let response = await axios.put('/api/user/cart', {
        cartid: itemToUpdate.cartid,
        menuid: itemToUpdate.id,
        quantity: newQuantity,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      if (response.status !== 200) {
        throw new Error("Failed update");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await axios.post("/api/auth/user/refreshtoken", {}, { withCredentials: true });
          // Retry the request
          await axios.put('/api/user/cart', {
            cartid: itemToUpdate.cartid,
            menuid: itemToUpdate.id,
            quantity: newQuantity,
          }, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          });
        } catch (refreshError) {
          toast.error("Session expired. Please log in again.", { autoClose: 1000 });
        }
      } else {
        console.error('Failed to update quantity:', error.message);
        toast.error("Failed to update quantity.", { autoClose: 1000 });
      }
    }
  };

  const removeItem = async (item) => {
    const body = {
      cartid: item.cartid,
      menuid: item.isService ? null : item.id,
      serviceid: item.isService ? item.id : null,
    };

    try {
      let response = await axios.delete('/api/user/cart', {
        data: body,
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Item removed from cart!", { autoClose: 1000 });
        fetchCart();
      } else {
        toast.error("Failed to remove item from cart.", { autoClose: 1000 });
      }
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await axios.post("/api/auth/user/refreshtoken", {}, { withCredentials: true });
          // Retry request
          const retryResponse = await axios.delete('/api/user/cart', {
            data: body,
            withCredentials: true,
          });

          if (retryResponse.status === 200) {
            toast.success("Item removed from cart!", { autoClose: 1000 });
            fetchCart();
          } else {
            toast.error("Failed to remove item from cart.", { autoClose: 1000 });
          }
        } catch (refreshError) {
          toast.error("Session expired. Please log in again.", { autoClose: 1000 });
        }
      } else {
        console.error("Error removing item from cart:", err.message);
        toast.error(err.response?.data?.error || "Error removing item from cart.", { autoClose: 1000 });
      }
    }
  };


  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalTax = subtotal * TAX_RATE;
  const total = subtotal + totalTax;

  const handleCheckout = () => {
    setShowModal(true);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 z-[50] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
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
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Your Cart</h2>

          {cart.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <>
              <motion.div
                className="hidden md:grid grid-cols-5 font-semibold text-gray-700 pb-2 border-b mb-4 z-[50]"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="col-span-2">Item</div>
                <div className="text-center">Quantity</div>
                <div className="text-center">Price</div>
                <div className="text-center">Taxes</div>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {cart.map(item => {
                  const itemTotal = item.price * item.quantity;
                  const itemTax = itemTotal * TAX_RATE;

                  return (
                    <motion.div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Item and Caterer Info */}
                      <div className="col-span-2 flex items-center gap-4">
                        {item.isService ? (
                          <a
                            href="#"
                            className="inline-block px-3 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-semibold"
                          >
                            Service: {item.name}
                          </a>
                        ) : (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        )}

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            from <span className="font-medium text-gray-700">{item.cateringname}</span>
                          </p>
                          <button
                            onClick={() => {
                              removeItem(item)
                              removeFromCart(item.id)
                            }}
                            className="text-red-500 cursor-pointer hover:text-red-700 mt-1 text-sm flex items-center gap-1"
                          >
                            <FaTrash size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex justify-center items-center gap-3">
                        {item.isService ? (
                          <span className="text-gray-800">{item.quantity}</span>
                        ) : (
                          <>
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="bg-gray-400 cursor-pointer hover:bg-gray-300 p-2 rounded"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="bg-gray-400 cursor-pointer hover:bg-gray-300 p-2 rounded"
                            >
                              <FaPlus size={12} />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-center font-semibold text-gray-800">
                        ₹{itemTotal.toFixed(2)}
                      </div>

                      {/* Tax */}
                      <div className="text-center text-gray-700">
                        ₹{itemTax.toFixed(2)}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Totals and Checkout */}
              <motion.div
                className="border-t pt-6 mt-8 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 md:space-x-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-center md:flex-row md:items-center md:space-x-6 space-y-2 md:space-y-0">
                  <p className="text-lg text-gray-800">Subtotal: ₹{subtotal.toFixed(2)}</p>
                  <p className="text-lg text-gray-800">Taxes (5%): ₹{totalTax.toFixed(2)}</p>
                  <p className="text-lg font-semibold text-gray-900">Total: ₹{total.toFixed(2)}</p>
                </div>

                <div className="text-right">
                  <button
                    onClick={handleCheckout}
                    className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300 w-full md:w-auto"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </motion.div>

            </>
          )}
        </>
      )}
      {showModal && <UserCheckout cart={cart} setShowModal={setShowModal} total={total} handleCartFetch={handleCartFetch} />}
    </motion.div>
  );
};

export default UserCart;
