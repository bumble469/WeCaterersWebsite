'use client';

import { useState } from "react";
import { motion } from "framer-motion";

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
    name: "Delicious Bites Catering",
    description:
      "Delicious Bites is a full-service catering company specializing in weddings, corporate events, and private parties. We provide exquisite food and exceptional service.",
    phone: "+1 (123) 456-7890",
    email: "contact@deliciousbites.com",
    address: "123 Gourmet Ave, Food City, FC 12345",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevProfile) => ({
          ...prevProfile,
          icon: reader.result,
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
      className="bg-white rounded-lg shadow-md p-6"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <motion.h2 className="text-2xl font-semibold text-gray-800" variants={fadeInUp}>
        Caterer Profile
      </motion.h2>
      <motion.p className="text-sm text-gray-500 mb-6" variants={fadeInUp}>
        Edit your profile details below.
      </motion.p>

      <motion.div className="flex space-x-4 items-center mb-6" variants={fadeInUp}>
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
          <img src={profile.icon} alt="Caterer Icon" className="w-full h-full object-cover" />
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleIconChange}
            className="py-2 px-4 bg-gray-100 rounded-lg text-gray-500"
          />
        </div>
      </motion.div>

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
  );
};

export default CatererDashboardProfile;
