'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const CatererDetailsModal = ({ caterer, isOpen, onClose, isGuest }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingApplied, setRatingApplied] = useState(false);
  const [existingRating, setExistingRating] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchExistingRating();
    } else {
      document.body.style.overflow = 'auto';
      setUserRating(0);
      setHoverRating(0);
      setRatingApplied(false);
      setExistingRating(null);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const fetchExistingRating = async () => {
    try {
      const response = await axios.get(`/api/user/home/ratings?cateringid=${caterer.cateringid}`, { withCredentials: true });
      if (response.status === 200 && response.data?.rating) {
        setExistingRating(response.data.rating);
        setUserRating(response.data.rating);
        setRatingApplied(true);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        const res = await refreshToken();
        if (res.status === 200) {
          return fetchExistingRating();
        }
      }
      console.error('Error fetching existing rating:', error);
    }
  };

  const postRating = async () => {
    return axios.post('/api/user/home/ratings', {
      cateringid: caterer.cateringid,
      rating: userRating,
    });
  };

  const refreshToken = async () => {
    return axios.post('/api/auth/user/refreshtoken');
  };

  const handleApplyRating = async () => {
    try {
      const response = await postRating();
      if (response.status === 200) {
        toast.info(`You rated ${caterer.cateringname}`, {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
      setRatingApplied(true);
      setExistingRating(userRating);
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const refreshResponse = await refreshToken();
          if (refreshResponse.status === 200) {
            const retryResponse = await postRating();
            if (retryResponse.status === 200) {
              setRatingApplied(true);
              setExistingRating(userRating);
            }
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
        }
      } else {
        console.error('Error rating:', error);
      }
    }
  };

  const Star = ({ index, filled, onClick, onMouseEnter, onMouseLeave, disabled }) => {
    const fill = filled ? 'text-yellow-400' : 'text-gray-300';
    const cursor = disabled ? 'cursor-default' : 'cursor-pointer';
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${cursor} ${fill}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        onClick={disabled ? undefined : onClick}
        onMouseEnter={disabled ? undefined : onMouseEnter}
        onMouseLeave={disabled ? undefined : onMouseLeave}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.178c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.286 3.97c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.38 2.455c-.785.57-1.84-.197-1.54-1.118l1.286-3.97a1 1 0 00-.364-1.118L3.622 9.397c-.783-.57-.38-1.81.588-1.81h4.178a1 1 0 00.95-.69l1.286-3.97z" />
      </svg>
    );
  };

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
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-red-500 text-2xl font-bold transition duration-200"
            onClick={onClose}
          >
            &times;
          </button>

          <div className="flex items-center space-x-6">
            <img
              src={caterer.cateringimage}
              alt={caterer.cateringname}
              className="w-48 h-48 object-cover rounded-full"
            />

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{caterer.cateringname}</h2>
              <p className="text-sm italic text-gray-600">{caterer.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                ⭐ {caterer?.rating} | Price range &#8377;{
                  caterer?.pricerange && caterer.pricerange.includes('-') 
                    ? caterer.pricerange.split('-')[0].trim() 
                    : "N/A"
                } - &#8377;{
                  caterer?.pricerange && caterer.pricerange.includes('-') 
                    ? caterer.pricerange.split('-')[1].trim() 
                    : "N/A"
                }
              </p>
              <div className="mt-4 text-gray-700">
                <h3 className="text-lg font-semibold">
                  Dedicated to Exceptional {caterer.eventtype} Experiences
                </h3>
                <p className="text-sm">Serving from: {caterer.address}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-md font-semibold mb-1 text-gray-500">
                  {ratingApplied ? 'Your Rating:' : 'Rate this Catering Service:'}
                </h4>

                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={`star-${star}`}
                      index={star}
                      filled={star <= (hoverRating || userRating)}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      disabled={isGuest}
                    />
                  ))}
                </div>

                 <button
                  disabled={isGuest}
                  onClick={handleApplyRating}
                  className={`mt-3 px-4 py-2 rounded bg-blue-600 text-white font-semibold transition 
                    disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                  Rate
                </button>

                {ratingApplied && (
                  <p className="mt-2 text-sm text-green-600">
                    Thank you! You rated {userRating} star{userRating > 1 ? 's' : ''}.
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

export default CatererDetailsModal;
