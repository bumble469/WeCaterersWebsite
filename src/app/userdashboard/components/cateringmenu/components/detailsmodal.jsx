'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MenuItemDetailsModal = ({ item, isOpen, onClose }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingApplied, setRatingApplied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setUserRating(0);
      setHoverRating(0);
      setRatingApplied(false);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const Star = ({ index }) => {
    const fill = (hoverRating || userRating) >= index ? 'text-yellow-400' : 'text-gray-300';
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 cursor-pointer ${ratingApplied ? 'cursor-default' : ''} ${fill}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={() => !ratingApplied && setUserRating(index)}
        onMouseEnter={() => !ratingApplied && setHoverRating(index)}
        onMouseLeave={() => !ratingApplied && setHoverRating(0)}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L3.622 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
      </svg>
    );
  };

  const handleApplyRating = () => {
    setRatingApplied(true);
  };

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
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500 text-2xl font-bold transition duration-200"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="flex items-center space-x-6">
            <img
              src={item.image_data}
              alt={item.name}
              className="w-48 h-48 object-cover rounded-full"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-sm italic text-gray-600">{item.tagline}</p>
              <p className="text-sm mt-2 text-gray-500">⭐ {item?.rating} | At ₹{item.price}</p>

              <div className="mt-4 text-gray-700 space-y-1">
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Dietary Preference:</strong> {item.dietarypreference}</p>
                <p><strong>Cuisine Type:</strong> {item.cuisinetype}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold mb-1 text-gray-500">Rate this Menu Item:</h4>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} index={star} />
                  ))}
                </div>

                <button
                  onClick={handleApplyRating}
                  disabled={userRating === 0 || ratingApplied}
                  className={`mt-3 px-4 py-2 rounded bg-blue-600 text-white font-semibold transition 
                    disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  {ratingApplied ? 'Rating Applied' : 'Rate'}
                </button>

                {ratingApplied && (
                  <p className="mt-2 text-sm text-green-600">
                    Thank you for rating {userRating} star{userRating > 1 ? 's' : ''}!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MenuItemDetailsModal;
