'use client';
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import defaultcatererbanner from "../../../assets/images/defaultcatererbanner.png";
import { FaPencilAlt } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingicon from "../../../assets/images/loadingicon.json";

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
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    icon: "/default-profile.png",
    banner: "",
    owner: "",
    name: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    eventtype: "",
  });

  const originalProfile = useRef({});

  const [isEditing, setIsEditing] = useState(false);

  const refreshToken = async () => {
    try {
      const res = await axios.post("/api/auth/caterer/refreshtoken", {}, {
        withCredentials: true,
      });
      return res.status === 200;
    } catch (err) {
      console.error("Token refresh failed:", err.message);
      return false;
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/caterer/profile",
        {},
        { withCredentials: true }
      );

      const data = res.data;
      const newProfile = {
        icon: data.cateringimage || null,
        banner: data.cateringbannerimage || "",
        owner: data.ownername || "",
        name: data.cateringname || "",
        description: data.description || "",
        phone: data.contact || "",
        email: data.email || "",
        address: data.address || "",
        eventtype: data.eventtype || "",
      };

      setProfile(newProfile);
      originalProfile.current = newProfile;
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) return fetchProfile();
      }

      console.error(
        "Failed to fetch caterer profile:",
        err.response?.data?.error || err.message
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

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

  const handleSave = async () => {
    try {
      const payload = {
        cateringname: profile.name,
        ownername: profile.owner,
        contact: profile.phone,
        email: profile.email,
        address: profile.address,
        description: profile.description,
        cateringimage: profile.icon,
        cateringbannerimage: profile.banner,
        eventtype: profile.eventtype,
      };

      const res = await axios.put("/api/caterer/profile", payload, {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("Profile updated successfully", {
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setIsEditing(false);
        fetchProfile();
      } else {
        toast.error("Profile update failed!", {
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        fetchProfile();
      }
    } catch (error) {
      if (error.response?.status === 401) {
        const refreshed = await refreshToken();
        if (refreshed) return handleSave(); // retry once
      }

      console.error("Update failed:", error.response?.data || error.message);
    }
  };


  const handleEditToggle = () => {
    if (isEditing) {
      setProfile(originalProfile.current);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Lottie animationData={loadingicon} loop={true} style={{ height: 50 }} />
        </div>
      ) : (
        <>
        <div className="relative">
          <img
            src={profile.banner || defaultcatererbanner.src}
            alt="Banner"
            className="w-full h-40 object-cover"
          />
          <label className="absolute top-3 border border-gray-500 right-3 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
            <FaPencilAlt className="text-gray-900 w-4 h-4" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, "banner")}
              className="hidden"
              disabled={!isEditing}
            />
          </label>

          {/* Edit/Cancel button below banner top-right */}
          <button
            onClick={handleEditToggle}
            className="absolute cursor-pointer right-3 top-[calc(100%+10px)] bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 font-semibold z-30"
            type="button"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <div className="relative left-6 bottom-10 w-32 h-32 rounded-full border-4 border-white bg-gray-200 z-10">
            <img
              src={profile.icon}
              alt="Caterer Icon"
              className="w-full h-full object-cover rounded-full"
            />
            <label className="absolute border border-gray-500 bottom-2 right-0 bg-white p-1 z-20 rounded-full shadow cursor-pointer hover:bg-gray-100">
              <FaPencilAlt className="text-gray-900 w-5 h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "icon")}
                className="hidden"
                disabled={!isEditing}
              />
            </label>
          </div>
        </div>

        <motion.div className="px-6 pb-6" variants={fadeInUp}>
        <motion.h2
          className="text-2xl font-semibold text-gray-800"
          variants={fadeInUp}
        >
          Caterer Profile
        </motion.h2>
        <motion.p
          className="text-sm text-gray-500 mb-6"
          variants={fadeInUp}
        >
          Edit your profile details below.
        </motion.p>

        {[
          { label: "Business Name", name: "name", type: "text" },
          { label: "Owner Name", name: "owner", type: "text" },
          { label: "Phone Number", name: "phone", type: "tel" },
          { label: "Email Address", name: "email", type: "email" },
          { label: "Address", name: "address", type: "text" },
          { label: "Description", name: "description", type: "text" },
        ].map((field, i) => (
          <motion.div
            className="mb-4"
            key={field.name}
            custom={i + 1}
            variants={fadeInUp}
          >
            <label
              className="block text-sm text-gray-700"
              htmlFor={field.name}
            >
              {field.label}
              {(!profile[field.name] || profile[field.name].trim() === "") && (
                <span className="text-red-500 ml-1" title="This field is required">
                  ⚠️
                </span>
              )}
            </label>
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={profile[field.name] || ""}
              onChange={handleProfileChange}
              className={`w-full p-3 border rounded-lg text-gray-700 ${
                isEditing
                  ? "border-gray-300"
                  : "border-transparent bg-gray-100 cursor-not-allowed"
              }`}
              readOnly={!isEditing}
            />
          </motion.div>
        ))}

        <motion.div className="mb-4" custom={7} variants={fadeInUp}>
          <label className="block text-sm text-gray-700" htmlFor="eventtype">
            Event Type
            {(!profile.eventtype || profile.eventtype.trim() === "") && (
              <span className="text-red-500 ml-1" title="This field is required">
                ⚠️
              </span>
            )}
          </label>
          <select
            id="eventtype"
            name="eventtype"
            value={profile.eventtype}
            onChange={handleProfileChange}
            className={`w-full p-3 border rounded-lg text-gray-700 ${
              isEditing
                ? "border-gray-300"
                : "border-transparent bg-gray-100 cursor-not-allowed"
            }`}
            disabled={!isEditing}
          >
            <option value="">Select an event type</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Corporate">Corporate</option>
            <option value="Festival">Festival</option>
            <option value="Other">Other</option>
          </select>
        </motion.div>

        {isEditing && (
          <motion.button
            onClick={handleSave}
            className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
            type="button"
            variants={fadeInUp}
          >
            Save Changes
          </motion.button>
        )}
      </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default CatererDashboardProfile;
