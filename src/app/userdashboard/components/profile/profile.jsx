'use client';
import { useState } from 'react';
import { FaEdit, FaSave, FaCamera, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '9876543210',
    address: '123 Main Street, City, Country',
    bio: 'Passionate chef, food enthusiast, and the proud owner of Tandoori Treats. Always striving for perfection in every dish!',
    profilePicture: '/images/profile.jpg', // Default profile image
    socialLinks: {
      instagram: 'https://instagram.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      facebook: 'https://facebook.com/johndoe'
    },
  });

  const handleEditToggle = () => {
    setIsEditing(prev => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserData(prev => ({ ...prev, profilePicture: URL.createObjectURL(file) }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save changes, e.g., call an API to update the profile
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 z-[50] relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex justify-between mb-8'>
        <h2 className="text-2xl font-bold text-gray-900">{isEditing ? 'Edit Profile' : 'Your Profile'}</h2>
        <div className="mt-8 flex justify-between items-center">
            {isEditing ? (
            <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
                <FaSave className="inline-block mr-2" /> Save Changes
            </button>
            ) : (
            <button
                onClick={handleEditToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition duration-300"
            >
                <FaEdit className="inline-block mr-2" /> Edit Profile
            </button>
            )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Left Section - Profile Picture */}
        <motion.div
          className="relative w-full h-80 flex justify-center items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-50 h-50 object-cover rounded-full border-4 border-gray-300"
          />
          {isEditing && (
            <label
              htmlFor="profile-picture"
              className="absolute bottom-1/2 right-1/2 bg-blue-600 text-white p-2 rounded-full cursor-pointer"
            >
              <FaCamera />
            </label>
          )}
          {isEditing && (
            <input
              type="file"
              id="profile-picture"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          )}
        </motion.div>

        {/* Middle Section - Personal Info */}
        <motion.div
          className="flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label className="font-semibold text-gray-700">Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                className="block w-full mt-2 p-2 border text-gray-600 border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-800">{userData.name}</p>
            )}
          </div>

          <div className="mt-2">
            <label className="font-semibold text-gray-700">Email:</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                className="block w-full mt-2 p-2 border text-gray-600 border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-800">{userData.email}</p>
            )}
          </div>

          <div className="mt-2">
            <label className="font-semibold text-gray-700">Phone:</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handleInputChange}
                className="block w-full mt-2 p-2 border text-gray-600 border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-800">{userData.phone}</p>
            )}
          </div>

          <div className="mt-2">
            <label className="font-semibold text-gray-700">Address:</label>
            {isEditing ? (
              <textarea
                name="address"
                value={userData.address}
                onChange={handleInputChange}
                rows="3"
                className="block w-full mt-2 p-2 border text-gray-600 border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-800">{userData.address}</p>
            )}
          </div>
        </motion.div>

        {/* Right Section - Social Links and Bio */}
        <motion.div
          className="flex flex-col justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <label className="font-semibold text-gray-700">Bio:</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                rows="4"
                className="block w-full mt-2 p-2 border text-gray-600 border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-gray-800">{userData.bio}</p>
            )}
          </div>

          <div className="mt-6">
            <p className="font-semibold text-gray-700">Social Links:</p>
            <div className="flex gap-4">
              <a href={userData.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <FaInstagram size={24} className="text-blue-600 hover:text-blue-700" />
              </a>
              <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter size={24} className="text-blue-400 hover:text-blue-500" />
              </a>
              <a href={userData.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                <FaFacebook size={24} className="text-blue-800 hover:text-blue-900" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfile;
