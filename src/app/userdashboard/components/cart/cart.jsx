'use client';
import { useState } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserCheckout from './components/checkoutmodal';

const dummyCart = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    price: 180,
    quantity: 2,
    image: "/images/paneer.jpg",
    caterer: "Tandoori Treats",
  },
  {
    id: 2,
    name: "Veg Biryani",
    price: 150,
    quantity: 1,
    image: "/images/biryani.jpg",
    caterer: "Spice Garden",
  },
];

const TAX_RATE = 0.05;

const UserCart = () => {
  const [cart, setCart] = useState(dummyCart);
  const [showModal, setShowModal] = useState(false); // Modal state

  const updateQuantity = (id, delta) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = id => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalTax = cart.reduce((acc, item) => acc + item.price * item.quantity * TAX_RATE, 0);
  const total = subtotal + totalTax;

  const handleCheckout = () => {
    setShowModal(true); // Open the modal
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 z-[50] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-8 text-gray-900">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          {/* Table Headings */}
          <motion.div
            className="hidden md:grid grid-cols-5 font-semibold text-gray-700 pb-2 border-b mb-4 z-[50]"
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="col-span-2">Item (Caterer)</div>
            <div className="text-center">Quantity</div>
            <div className="text-center">Price</div>
            <div className="text-center">Taxes</div>
          </motion.div>

          {/* Cart Items */}
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
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">from <span className="font-medium text-gray-700">{item.caterer}</span></p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 mt-1 text-sm flex items-center gap-1"
                      >
                        <FaTrash size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex justify-center items-center gap-3">
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
            className="border-t pt-6 mt-8 space-y-2 flex justify-between items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg text-gray-800">Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p className="text-lg text-gray-800">Taxes (5%): ₹{totalTax.toFixed(2)}</p>
            <p className="text-2xl font-semibold text-gray-900">Total: ₹{total.toFixed(2)}</p>

            <div className="text-right">
              <button
                onClick={handleCheckout} // Handle checkout button click
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        </>
      )}

      {/* Conditionally Render Checkout Modal */}
      {showModal && <UserCheckout cart={cart} setShowModal={setShowModal} total={total} />}
    </motion.div>
  );
};

export default UserCart;
