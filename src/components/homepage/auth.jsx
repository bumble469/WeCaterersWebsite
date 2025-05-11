"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user'); // Add state for user type
  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className="flex items-center justify-center p-2 mt-2 min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl text-center text-gray-800 mb-6">
              {isLogin ? 'Login to Your Account' : 'Create an Account'}
            </h2>

            {/* User Type Selection with Buttons */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Select User Type</label>
              <div className="flex gap-x-4">
                <button
                  onClick={() => setUserType('user')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold w-32 transition-all cursor-pointer ${
                    userType === 'user'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  User
                </button>
                <button
                  onClick={() => setUserType('caterer')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold w-32 transition-all cursor-pointer ${
                    userType === 'caterer'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Caterer
                </button>
              </div>
            </div>

            <form className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block mb-1 font-medium !text-gray-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 !text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 !text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium !text-gray-700">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 !text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-transparent border text-black py-2 rounded-lg hover:bg-gray-200 transition"
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center mt-4">
              <button
                onClick={toggleForm}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Login'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
