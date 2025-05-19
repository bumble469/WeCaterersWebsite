import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaSave, FaCamera, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingicon from "../../../../assets/images/loadingicon.json";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axios.post("/api/user/profile", {}, { withCredentials: true });
      const data = res.data;
      setUserData({
        fullname: data.fullname || "",
        email: data.email || "",
        contact: data.contact || "",
        address: data.address || "",
        bio: data.bio || "",
        profilePicture: data.profilephoto || "", 
        socialLinks: {
          instagram: data.sociallink1 || "",
          twitter: data.sociallink2 || "",
          facebook: data.sociallink3 || "",
        },
      });
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await axios.post("/api/auth/user/refreshtoken", {}, { withCredentials: true });
          const retryRes = await axios.post("/api/user/profile", {}, { withCredentials: true });
          const retryData = retryRes.data;
          setUserData({
            fullname: retryData.fullname || "",
            email: retryData.email || "",
            contact: retryData.contact || "",
            address: retryData.address || "",
            bio: retryData.bio || "",
            profilePicture: retryData.profilephoto || "", 
            socialLinks: {
              instagram: retryData.sociallink1 || "",
              twitter: retryData.sociallink2 || "",
              facebook: retryData.sociallink3 || "",
            },
          });
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
        }
      } else {
        console.error("Failed to fetch profile:", err);
      }
    }
  };


  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          profilePicture: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSave = async () => {
    try {
      const payload = {
        name: userData.fullname || "",
        email: userData.email || "",
        phone: userData.contact || "",
        address: userData.address || "",
        bio: userData.bio || "",
        profilePicture: userData.profilePicture || "",
        socialLinks: {
          instagram: userData.socialLinks?.instagram || "",
          twitter: userData.socialLinks?.twitter || "",
          facebook: userData.socialLinks?.facebook || "",
        },
      };

      console.log("Payload being sent:", payload);

      const res = await axios.put("/api/user/profile", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (res.status === 200) {
        setUserData((prev) => ({
          ...prev,
          ...payload,
        }));
        setIsEditing(false);
      } else {
        console.error("Failed to update profile");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        try {
          await axios.post("/api/auth/user/refreshtoken", {}, { withCredentials: true });

          const retryRes = await axios.put("/api/user/profile", {
            name: userData.fullname || "",
            email: userData.email || "",
            phone: userData.contact || "",
            address: userData.address || "",
            bio: userData.bio || "",
            profilePicture: userData.profilePicture || "",
            socialLinks: {
              instagram: userData.socialLinks?.instagram || "",
              twitter: userData.socialLinks?.twitter || "",
              facebook: userData.socialLinks?.facebook || "",
            },
          }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          });

          if (retryRes.status === 200) {
            setUserData((prev) => ({
              ...prev,
              ...payload,
            }));
            setIsEditing(false);
          } else {
            console.error("Failed to update profile on retry");
          }
        } catch (refreshErr) {
          console.error("Token refresh failed:", refreshErr);
          // Optional: logout or redirect user here
        }
      } else {
        console.error("Error updating profile:", err);
      }
    }
  };


  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 z-[50] relative"    
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    {!userData ? (
      <div className="flex justify-center items-center h-[50vh]">
        <Lottie animationData={loadingicon} loop={true} style={{ height: 50 }} />
      </div>
    ):(
      <>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Profile" : "Your Profile"}
          </h2>
          <div>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md flex items-center gap-2 text-sm sm:text-base transition duration-300"
              >
                <FaSave /> Save Changes
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md flex items-center gap-2 text-sm sm:text-base transition duration-300"
              >
                <FaEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Picture */}
          <motion.div
            className="relative w-full h-60 flex justify-center items-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={userData.profilePicture}
              alt="Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-300"
            />
            {isEditing && (
              <>
                <label
                  htmlFor="profile-picture"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full cursor-pointer text-lg"
                >
                  <FaCamera />
                </label>
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </>
            )}
          </motion.div>

          {/* Personal Info */}
          <motion.div
            className="flex flex-col justify-start space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {[
              { label: "Name:", name: "fullname", type: "text", required: true },
              { label: "Email:", name: "email", type: "email", required: true },
              { label: "Phone:", name: "contact", type: "text", required: true },
            ].map(({ label, name, type, required }) => (
              <div key={name}>
                <label className="font-semibold text-gray-700 text-sm sm:text-base">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={userData[name] || ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`block w-full mt-1 p-2 text-sm sm:text-base border rounded-md ${
                    isEditing
                      ? "border-gray-300 text-gray-600"
                      : "border-transparent bg-transparent text-gray-800 cursor-default"
                  }`}
                />
                {required && !userData[name] && (
                  <span className="text-red-500 text-xs ml-1" title="This field is required">
                    ⚠️
                  </span>
                )}
              </div>
            ))}

            <div>
              <label className="font-semibold text-gray-700 text-sm sm:text-base">Address:</label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={userData.address || ""}
                  onChange={handleInputChange}
                  rows="2"
                  className="block w-full mt-1 p-2 text-sm sm:text-base border border-gray-300 rounded-md text-gray-600 resize-none"
                />
              ) : (
                <textarea
                  name="address"
                  value={userData.address || ""}
                  disabled
                  rows="2"
                  className="block w-full mt-1 p-2 text-sm sm:text-base border-transparent bg-transparent text-gray-800 cursor-default resize-none"
                />
              )}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex flex-col justify-start space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Bio */}
            <div>
              <label className="font-semibold text-gray-700 text-sm sm:text-base">Bio:</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={userData.bio || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="block w-full mt-1 p-2 text-sm sm:text-base border border-gray-300 rounded-md text-gray-600 resize-none"
                />
              ) : (
                <textarea
                  name="bio"
                  value={userData.bio || ""}
                  disabled
                  rows="3"
                  className="block w-full mt-1 p-2 text-sm sm:text-base border-transparent bg-transparent text-gray-800 cursor-default resize-none"
                />
              )}
            </div>

            {/* Social Links */}
            <div>
              <label className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Social Links:</label>
              <div className={`flex ${isEditing ? 'flex-col' : 'flex-row items-start gap-4'}`}>
                {[
                  { icon: <FaInstagram className="text-pink-600 text-2xl" />, name: "instagram", placeholder: "Instagram URL" },
                  { icon: <FaTwitter className="text-blue-400 text-2xl" />, name: "twitter", placeholder: "Twitter URL" },
                  { icon: <FaFacebook className="text-blue-700 text-2xl" />, name: "facebook", placeholder: "Facebook URL" },
                ].map(({ icon, name, placeholder }) => (
                  <div key={name} className="flex items-center gap-2 mb-2">
                    {isEditing ? (
                      <>
                        {icon}
                        <input
                          type="text"
                          name={name}
                          placeholder={placeholder}
                          value={userData.socialLinks?.[name] || ""}
                          onChange={handleSocialLinkChange}
                          className="flex-grow p-2 text-sm sm:text-base border border-gray-300 rounded-md text-gray-600"
                        />
                      </>
                    ) : (
                      userData.socialLinks?.[name] ? (
                        <a href={userData.socialLinks[name]} target="_blank" rel="noopener noreferrer">
                          {icon}
                        </a>
                      ) : (
                        icon
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </>
      )
    }
    </motion.div>
  );
};
export default UserProfile;