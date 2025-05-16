'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';

const AdminProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Admin',
    email: 'admin@example.com',
    phone: '+1 234 567 890',
    role: 'Administrator',
    bio: 'Passionate about managing operations and user experience.',
    imageUrl: 'https://i.pravatar.cc/150?img=12',
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      >

      {/* Profile Image with Edit Icon */}
      <div className="flex justify-center mb-6 relative group">
        <button
          onClick={toggleEdit}
          className="absolute top-2 right-2 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md focus:outline-none"
          aria-label={isEditing ? "Cancel Edit" : "Edit Profile"}
        >
          {isEditing ? <FaTimes /> : <FaEdit />}
          <span>{isEditing ? 'Cancel' : 'Edit'}</span>
        </button>
        <motion.img
          src={profile.imageUrl}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-600 shadow-lg"
          layoutId="profile-image"
        />
        {isEditing && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            whileHover={{ scale: 1.2 }}
            className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md text-white cursor-pointer"
            aria-label="Edit profile image"
            onClick={() => alert('Open image upload dialog')}
          >
            <FaPencilAlt />
          </motion.button>
        )}
      </div>

      {/* Profile Details */}
      <div className="space-y-4 text-gray-800">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.input
                key="name-input"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              />
            ) : (
              <motion.p
                key="name-text"
                className="text-lg font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {profile.name}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">Email</label>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.input
                key="email-input"
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              />
            ) : (
              <motion.p
                key="email-text"
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {profile.email}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.input
                key="phone-input"
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              />
            ) : (
              <motion.p
                key="phone-text"
                className="text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {profile.phone}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold mb-1">Role</label>
          <motion.p className="text-gray-700">{profile.role}</motion.p>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-semibold mb-1">Bio</label>
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.textarea
                key="bio-input"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              />
            ) : (
              <motion.p
                key="bio-text"
                className="text-gray-600 whitespace-pre-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {profile.bio}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <motion.div
          className="mt-6 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            onClick={() => {
              alert('Profile saved!');
              setIsEditing(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md shadow-md focus:outline-none flex items-center gap-2"
          >
            <FaSave /> Save Changes
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminProfile;
