import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import Filters from './components/filter';
import CatererDetailsModal from "./components/detailsmodal";
import axios from "axios";
import { toast } from 'react-toastify';
import Lottie from "lottie-react";
import loadinglottie from "../../../../assets/images/loadingicon.json";

const UserHome = ({ setSelectedOrderCaterer, setActiveTab, isGuest }) => {
  const [caterers, setCaterers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    eventtype: "All",
    rating: "All",
    price: "All",
    location: "",
  });
  const [filteredCaterers, setFilteredCaterers] = useState([]);
  const [isCatererDetailsModalOpen, setIsCatererDetailsModalOpen] = useState(false);
  const [selectedCaterer, setSelectedCaterer] = useState(null);

  const fetchCaterers = async () => {
    if(isGuest){
      setLoading(true);
      const getGuestCaterers = await axios.get("/api/user/guest");
      if (getGuestCaterers.status == 200) {
        setCaterers(getGuestCaterers.data.data);
        setLoading(false);
      } else {
        toast.error("Error fetching caterers!");
      }
    }else{
      setLoading(true);
      const getCaterers = async () => {
        return await axios.get("/api/user/home/caterers", { withCredentials: true });
      };
      try {
        let response = await getCaterers();

        if (response.status === 401) {
          await axios.post("/api/auth/user/refreshtoken", {}, { withCredentials: true });
          response = await getCaterers();
        }
        if (response.status === 200) {
          setCaterers(response.data.data);
        } else {
          toast.error("Error fetching caterers!");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          try {
            await axios.post("/api/auth/user/refreshtoken", {}, { withCredentials: true });
            const retryResponse = await getCaterers();
            if (retryResponse.status === 200) {
              setCaterers(retryResponse.data.data);
              return;
            } else {
              toast.error("Error fetching caterers after token refresh!");
            }
          } catch (refreshErr) {
            toast.error("Session expired. Please login again.");
            console.log("Token refresh failed:", refreshErr.message);
          }
        } else {
          console.log("Error fetching caterers:", err.message);
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCaterers();
  }, [setActiveTab]);

  useEffect(() => {
    setFilteredCaterers(caterers);
  }, [caterers]);
  

  const applyFilters = () => {
    let result = caterers;

    if (filters.eventtype !== "All") {
      result = result.filter(c => c.eventtype === filters.eventtype);
    }

    if (filters.rating !== "All") {
      const minRating =
        filters.rating === "4 stars & above" ? 4 :
        filters.rating === "3 stars & above" ? 3 : 0;
      result = result.filter(c => c.rating >= minRating);
    }

    if (filters.price !== "All") {
      result = result.filter(c => {
        if (filters.price === "₹200 - ₹500") {
          return c.pricerange === "290.00 - 410.00" || c.pricerange === "₹200 - ₹500";
        }
        if (filters.price === "₹500 - ₹1000") {
          return c.pricerange === "₹500 - ₹1000";
        }
        if (filters.price === "₹1000+") {
          return c.pricerange === "₹1000+";
        }
      });
    }

    if (filters.location.trim() !== "") {
      result = result.filter(c =>
        c.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredCaterers(result);
  };

  const resetFilters = () => {
    setFilters({ eventtype: "All", rating: "All", price: "All", location: "" });
    setFilteredCaterers(caterers);
  };

  const handleViewDetails = (caterer) => {
    setSelectedCaterer(caterer);
    setIsCatererDetailsModalOpen(true);
  };

  const handleSelectedCaterer = (caterer) => {
    setSelectedOrderCaterer(caterer);
    setActiveTab("menu");
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row min-h-screen bg-white text-gray-700 pt-4"
        >
          {/* Toggle Button for Mobile */}
          <div className="md:hidden p-4 bg-white shadow flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-blue-600 font-semibold cursor-pointer transition duration-100 hover:scale-102"
            >
              <FiFilter className="mr-2 text-xl" />
              Filters
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className="md:w-1/4 w-full">
            <AnimatePresence>
              {(showFilters || typeof window === 'undefined') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden p-4 bg-white shadow-md border-b border-gray-200"
                >
                  <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} resetFilters={resetFilters} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden md:block p-6 bg-white shadow-md rounded-md border border-gray-200 h-screen sticky top-0 overflow-hidden">
              <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} resetFilters={resetFilters} />
            </div>
          </div>

          {/* Caterer Cards or Loading */}
          <motion.div
            layout
            className="md:w-3/4 w-full p-4 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <Lottie
                  animationData={loadinglottie}
                  loop={true}
                  style={{ width: 50, height: 50 }}
                />
              </div>
            ) : filteredCaterers.length === 0 ? (
              <p className="w-full text-center text-lg text-gray-600">
                No caterers found.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCaterers.map(caterer => (
                  <motion.div
                    key={caterer.cateringid}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white max-h-95 rounded-lg shadow hover:shadow-xl transition flex flex-col"
                  >
                    <div className="relative">
                      <Image
                        src={caterer.cateringimage}
                        alt={caterer.cateringname}
                        width={400}
                        height={250}
                        className="rounded-t-lg object-cover w-full h-48"
                      />
                      {caterer?.rating > 4.7 && (
                        <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-white px-2 py-1 rounded">
                          Top Rated
                        </span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="text-lg font-semibold">{caterer.cateringname}</h3>
                        <p className="text-sm italic text-gray-600">{caterer.description}</p>
                        <p className="text-sm mt-1">
                          ⭐ {caterer?.rating} | Starting from {typeof caterer?.pricerange === "string" && caterer.pricerange.includes("-") ? caterer.pricerange.split("-")[0] : "Not available"}
                        </p>
                      </div>
                      <div className="flex justify-between mt-4 gap-2">
                        <button
                          onClick={() => handleViewDetails(caterer)}
                          className="bg-blue-600 cursor-pointer text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition flex-1"
                        >
                          View Details
                        </button>
                        <button
                          disabled={isGuest}
                          onClick={() => handleSelectedCaterer(caterer)}
                          className={`bg-green-600 cursor-pointer text-white text-sm py-2 px-4 rounded hover:bg-green-700 transition flex-1 ${isGuest ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          Order From
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <CatererDetailsModal
        isOpen={isCatererDetailsModalOpen}
        caterer={selectedCaterer}
        onClose={() => setIsCatererDetailsModalOpen(false)}
        isGuest={isGuest}
      />
    </>
  );
};

export default UserHome;
