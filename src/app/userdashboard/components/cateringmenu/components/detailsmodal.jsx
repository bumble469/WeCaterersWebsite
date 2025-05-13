'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const MenuItemDetailsModal = ({ item, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-[1px] z-50 pointer-events-auto" />

      <motion.div
        className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
          <button
            className="absolute top-4 right-4 text-gray-700 text-2xl transition duration-150 hover:scale-110 cursor-pointer"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="flex items-center space-x-6">
            <img
              src={item.image}
              alt={item.name}
              className="w-48 h-48 object-cover rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-sm italic text-gray-600">{item.tagline}</p>
              <p className="text-sm mt-2">⭐ {item.rating} | Starting from ₹{item.price}</p>
              <div className="mt-4 text-gray-700">
                <h3 className="text-lg font-semibold">Event Type: {item.eventType}</h3>
                <p className="text-sm">{item.location}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MenuItemDetailsModal;
