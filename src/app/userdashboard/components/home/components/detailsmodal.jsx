'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

const CatererDetailsModal = ({ caterer, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      // Disable body scroll when the modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when the modal is closed
      document.body.style.overflow = 'auto';
    }

    // Cleanup when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay with slight blur and no interaction */}
      <div className="fixed inset-0 backdrop-blur-[1px] z-50 pointer-events-auto" />
      
      {/* Modal content */}
      <motion.div
        className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500 text-2xl font-bold transition duration-200"
            onClick={onClose}
          >
            &times;
          </button>
          
          {/* Modal Content */}
          <div className="flex items-center space-x-6">
            {/* Left Image */}
            <img
              src={caterer.image}
              alt={caterer.name}
              className="w-48 h-48 object-cover rounded-full"
            />

            {/* Right Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{caterer.name}</h2>
              <p className="text-sm italic text-gray-600">{caterer.tagline}</p>
              <p className="text-sm text-gray-500 mt-2">⭐ {caterer.rating} | Starting from {caterer.price}</p>
              
              <div className="mt-4 text-gray-700">
                <h3 className="text-lg font-semibold">Event Type: {caterer.eventType}</h3>
                <p className="text-sm">{caterer.location}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default CatererDetailsModal;
