'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import defaultcatererbanner from "../../../assets/images/defaultcatererbanner.png";
import { FaPencilAlt } from "react-icons/fa"; // Add this package if not already installed

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const CatererDashboardProfile = () => {
  const [profile, setProfile] = useState({
    icon: "/default-profile.png",
    banner: "", // Initially no banner
    name: "Delicious Bites Catering",
    description:
      "Delicious Bites is a full-service catering company specializing in weddings, corporate events, and private parties. We provide exquisite food and exceptional service.",
    phone: "+1 (123) 456-7890",
    email: "contact@deliciousbites.com",
    address: "123 Gourmet Ave, Food City, FC 12345",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({
          ...prev,
          [type]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Profile saved", profile);
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {/* Banner and Profile Picture */}
      <div className="relative">
        <img
          src={profile.banner || defaultcatererbanner.src}
          alt="Banner"
          className="w-full h-40 object-cover"
        />
        {/* Banner Edit Icon */}
        <label className="absolute top-5 right-2 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
          <FaPencilAlt className="text-gray-600 w-4 h-4" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'banner')}
            className="hidden"
          />
        </label>

        {/* Profile Icon with Edit */}
        <div className="absolute left-6 bottom-10 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200 z-10 relative">
          <img
            src={profile.icon}
            alt="Caterer Icon"
            className="w-full h-full object-cover"
          />
          {/* Profile Icon Edit */}
          <label className="absolute bottom-3 right-3 bg-white p-1 z-[10] rounded-full shadow cursor-pointer hover:bg-gray-100">
            <FaPencilAlt className="text-gray-600 w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'icon')}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Form Content */}
      <motion.div className="px-6 pb-6" variants={fadeInUp}>
        <motion.h2 className="text-2xl font-semibold text-gray-800" variants={fadeInUp}>
          Caterer Profile
        </motion.h2>
        <motion.p className="text-sm text-gray-500 mb-6" variants={fadeInUp}>
          Edit your profile details below.
        </motion.p>

        {[ 
          { label: "Business Name", name: "name", type: "text" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Address", name: "address", type: "text" },
        ].map((field, i) => (
          <motion.div className="mb-4" key={field.name} custom={i + 1} variants={fadeInUp}>
            <label className="block text-sm text-gray-700" htmlFor={field.name}>{field.label}</label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={profile[field.name]}
              onChange={handleProfileChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-500"
            />
          </motion.div>
        ))}

        <motion.div className="mb-6" custom={5} variants={fadeInUp}>
          <label className="block text-sm text-gray-700" htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={profile.description}
            onChange={handleProfileChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-500"
          />
        </motion.div>

        <motion.button
          onClick={handleSave}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          variants={fadeInUp}
          custom={6}
        >
          Save Changes
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default CatererDashboardProfile;
