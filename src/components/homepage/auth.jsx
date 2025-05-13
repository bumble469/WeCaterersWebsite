"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const initialErrors = {
  fullName: '',
  cateringName: '',
  ownerName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const AuthComponent = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    fullName: '',
    cateringName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState(initialErrors);
  const [isValid, setIsValid] = useState(false);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    let error = '';
    if (field === 'email' && !emailRegex.test(value)) {
      error = 'Invalid email format';
    } else if (field === 'password' && !passwordRegex.test(value)) {
      error = 'Password must be 8+ chars with uppercase, lowercase, number, and special character';
    } else if (field === 'confirmPassword' && value !== formData.password) {
      error = 'Passwords do not match';
    } else if ((field === 'fullName' || field === 'cateringName' || field === 'ownerName') && !value.trim()) {
      error = 'This field is required';
    }
    setErrors({ ...errors, [field]: error });
  };

  useEffect(() => {
    // Check form validity
    const isSignup = !isLogin;
    const relevantFields = userType === 'user'
      ? ['fullName', 'email', 'password', 'confirmPassword']
      : ['cateringName', 'ownerName', 'email', 'password', 'confirmPassword'];

    const allFilled = relevantFields.every(field => formData[field].trim() !== '');
    const allValid = relevantFields.every(field => errors[field] === '');

    setIsValid(isLogin || (isSignup && allFilled && allValid));
  }, [formData, errors, isLogin, userType]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    console.log("Submitted Data:", { userType, ...formData });
  };

  return (
    <div className={`flex items-center justify-center my-6 ${!isLogin ? 'md:pt-15': ''}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md pt-12"
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

            <div className="mb-6">
              <div className="flex gap-x-4">
                {['user', 'caterer'].map(type => (
                  <button
                    key={type}
                    onClick={() => setUserType(type)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold w-32 transition-all cursor-pointer ${
                      userType === type
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-sm">
              {!isLogin && (
                <>
                  {userType === 'user' && (
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-1 border rounded-lg text-gray-700"
                        value={formData.fullName}
                        onChange={e => handleChange('fullName', e.target.value)}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                    </div>
                  )}

                  {userType === 'caterer' && (
                    <>
                      <div>
                        <label className="block mb-1 font-medium text-gray-700">Catering Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1 border rounded-lg text-gray-700"
                          value={formData.cateringName}
                          onChange={e => handleChange('cateringName', e.target.value)}
                        />
                        {errors.cateringName && <p className="text-red-500 text-xs">{errors.cateringName}</p>}
                      </div>
                      <div>
                        <label className="block mb-1 font-medium text-gray-700">Owner Name</label>
                        <input
                          type="text"
                          className="w-full px-3 py-1 border rounded-lg text-gray-700"
                          value={formData.ownerName}
                          onChange={e => handleChange('ownerName', e.target.value)}
                        />
                        {errors.ownerName && <p className="text-red-500 text-xs">{errors.ownerName}</p>}
                      </div>
                    </>
                  )}
                </>
              )}

              <div>
                <label className="block mb-1 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-1 border rounded-lg text-gray-700"
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              <div>
                <label className="block mb-1 font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-1 border rounded-lg text-gray-700"
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              {!isLogin && (
                <div>
                  <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full px-3 py-1 border rounded-lg text-gray-700"
                    value={formData.confirmPassword}
                    onChange={e => handleChange('confirmPassword', e.target.value)}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-1.5 rounded-lg transition text-sm ${
                  isValid
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
              >
                {isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>


            <div className="text-center mt-4">
              <button
                onClick={toggleForm}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
              >
                {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthComponent;
