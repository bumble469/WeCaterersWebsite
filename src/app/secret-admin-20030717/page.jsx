"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loadingicon from "../../assets/images/loadingicon.json";
import Lottie from "lottie-react";

export default function SecretAdminPage() {
  const [step, setStep] = useState("key");
  const [secretKey, setSecretKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const SECRET = process.env.NEXT_PUBLIC_SECRET_ADMIN_KEY;

  const [keyAttempts, setKeyAttempts] = useState(0);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const handleSecretSubmit = (e) => {
    e.preventDefault();
    if (secretKey.trim() === (SECRET?.trim() || "")) {
      setStep("login");
      setKeyAttempts(0);
    } else {
      const newAttempts = keyAttempts + 1;
      setKeyAttempts(newAttempts);
      toast.error("Wrong secret key!", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      if (newAttempts >= 3) {
        router.push("/");
      }
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/admin/login", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Login successful!", {
          autoClose: 1000,
          hideProgressBar: true,
        });
        setLoginAttempts(0);
        setTimeout(() => {
          router.push("/admindashboard");
        }, 1100); // delay to allow toast to show
      } else {
        setLoading(false);
        toast.error("Login failed. Please try again.", {
          autoClose: 1000,
          hideProgressBar: true,
        });
      }
    } catch (error) {
      setLoading(false);
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      toast.error(error.response?.data?.error || "Invalid credentials!", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      if (newAttempts >= 3) {
        router.push("/");
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {step === "key" && (
            <motion.div
              key="key"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Admin Access
              </h1>
              <form onSubmit={handleSecretSubmit} className="space-y-6">
                <div>
                  <label className="block text-left text-gray-600 font-medium mb-1">
                    Secret Key
                  </label>
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter secret key"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-all duration-200"
                >
                  Continue
                </button>
              </form>
            </motion.div>
          )}

          {step === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-lg"
            >
              <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Admin Login
              </h1>
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                  <label className="block text-left text-gray-600 font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-left text-gray-600 font-medium mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
                    />
                    <span
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition-all duration-200 flex items-center justify-center ${
                    loading ? "cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <Lottie
                      animationData={loadingicon}
                      loop={true}
                      style={{ width: 30, height: 30 }}
                    />
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
