"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CateringServiceModal = ({ isOpen, onClose, serviceDetails, handleAdd }) => {
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

    const AddToCart = async () => {
        const cartItem = {
            cateringid: serviceDetails?.cateringId, 
            menuid: null,
            serviceid: serviceDetails?.serviceId, 
            quantity: 1,
        };

        try {
            const response = await axios.post('/api/user/cart', cartItem, { withCredentials: true });

            if (response.status === 200) {
            toast.success("Service added to cart!", {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            handleAdd?.(cartItem);
            } else {
            toast.error("Could not add service to cart!", {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            }
        } catch (err) {
            if (err.response?.status === 401) {
            try {
                const refreshResponse = await axios.post('/api/auth/user/refreshtoken', {}, { withCredentials: true });
                if (refreshResponse.status === 200) {
                try {
                    const retryResponse = await axios.post('/api/user/cart', cartItem, { withCredentials: true });
                    if (retryResponse.status === 200) {
                    toast.success("Service added to cart!", {
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                        draggable: false,
                        progress: undefined,
                    });
                    handleAdd?.(cartItem);
                    return;
                    }
                } catch (retryErr) {
                    console.error("Retry after token refresh failed:", retryErr);
                }
                }
            } catch (refreshErr) {
                console.error("Token refresh failed:", refreshErr);
            }

            toast.error("Session expired. Please login again.", {
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            // Optionally redirect to login page here:
            // router.push('/login');

            } else if (err.response?.status === 409) {
            toast.error("Service already in cart!", {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            } else {
            toast.error("Error adding service to cart!", {
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
            });
            console.error("Error while adding service to cart:", err.message);
            }
        }
        };



    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex justify-center items-center pointer-events-auto">
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-opacity-40 backdrop-blur-[2px]"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    className="relative bg-white rounded-xl shadow-xl p-6 w-full max-w-lg z-10"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl text-gray-800 font-bold">Service Details</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 cursor-pointer hover:text-red-500 text-2xl font-bold transition duration-200"
                        >
                            &times;
                        </button>
                    </div>

                    {/* Details */}
                    <div className="space-y-4 text-gray-700">
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Name</p>
                            <p className="text-lg font-medium">{serviceDetails?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-500">Description</p>
                            <p className="text-base">{serviceDetails?.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Price</p>
                                <p className="text-base">&#8377;{serviceDetails?.price}</p>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-500">Capacity</p>
                                <p className="text-base">{serviceDetails?.capacity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Add Service Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={AddToCart}
                            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
                        >
                            Add Service
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CateringServiceModal;
