import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingicon from "../../assets/images/loadingicon.json";

const OtpModal = ({ isOpen, onClose, email, userType, setLogin }) => {
    const [loading, setLoading] = useState(false);

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

  const [otp, setOtp] = useState('');
    
  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/auth/${userType}/signup`, {
        mode:"verify",
        email,
        code: otp,
      });
      console.log(email+" "+otp);
      if(response.status == 200){
        toast.success("Signup successful!");
        onClose();
        setLogin(true);
      }else{
        toast.error("Error creating account!");
      }
    } catch (error) {
      console.error('Verification failed:', error.response?.data || error.message);
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[1px] pointer-events-auto flex justify-center items-center z-50 pointer-events-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm"
      >
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">Verify OTP</h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          An OTP has been sent to <strong>{email}</strong>
        </p>
        <input
          type="text"
          maxLength={6}
          className="w-full px-4 py-2 border rounded-lg mb-4 text-gray-700 text-center"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <Lottie animationData={loadingicon} style={{height:'2.5rem', width:'2.5rem'}} />
            ) : (
              <>Verify</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpModal;
