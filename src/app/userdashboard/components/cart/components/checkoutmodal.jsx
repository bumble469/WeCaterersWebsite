import { motion } from 'framer-motion';

const UserCheckout = ({ cart, setShowModal, total }) => {
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/50 z-50 pointer-events-auto" />
      
      {/* Modal */}
      <motion.div
        className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">Checkout</h2>

          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b py-3">
                <div>
                  <p className="text-lg font-medium text-gray-800">{item.name} x{item.quantity}</p>
                  <p className="text-sm text-gray-600">from {item.caterer}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total Amount */}
          <div className="mt-6 flex justify-between font-semibold text-gray-900 border-t pt-4">
            <span>Total:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8 space-x-4">
            <button
              onClick={() => setShowModal(false)} // Close the modal
              className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400 py-3 rounded-lg transition duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => alert('Order Placed!')} // Add functionality here to place the order
              className="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-lg transition duration-300"
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
