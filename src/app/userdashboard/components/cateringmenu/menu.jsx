"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FiFilter } from "react-icons/fi";
import Filters from "./components/filters";
import MenuItemDetailsModal from "./components/detailsmodal";
import CateringServiceModal from "./components/servicemodal";
import axios from "axios";
import { toast } from "react-toastify";
import Lottie from "lottie-react";
import loadinglottie from "../../../../assets/images/loadingicon.json";

const CateringMenu = ({cateringid}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [services, setServices] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    price: Infinity,
    rating: null,
    cuisinetype: "",
    dietarypreference: "", 
  });

  const [appliedFilters, setAppliedFilters] = useState(filters);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchMenuItems();
    fetchServices();
  }, []);

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/home/menu?cateringid=${cateringid}`);
      if (response.status === 200) {
        setMenuItems(response.data);
      } else {
        toast.error("Could not fetch menu items!");
      }
    } catch (err) {
      console.log("Error fetching menu: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/home/services?cateringid=${cateringid}`);
      if (response.status === 200) {
        setServices(response.data);
      } else {
        toast.error("Could not fetch services!");
      }
    } catch (err) {
      console.log("Error fetching services: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };

  const filteredItems = menuItems.filter((item) => {
    const maxPrice = appliedFilters.price ?? Infinity;
    const meetsPrice = item.price <= maxPrice;

    const meetsRating =
      appliedFilters.rating === null || (item.rating ?? 0) >= appliedFilters.rating;

    const meetsCuisine = appliedFilters.cuisinetype
      ? item.cuisinetype?.toLowerCase().includes(appliedFilters.cuisinetype.toLowerCase())
      : true;
    
    const meetsDietary = appliedFilters.dietarypreference
      ? item.dietarypreference === appliedFilters.dietarypreference
      : true;

    return meetsPrice && meetsRating && meetsCuisine && meetsDietary;
  });


  const applyFilters = () => {
    setAppliedFilters(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaults = { price: null, rating: null, cuisinetype: "" , dietarypreference:""};
    setFilters(defaults);
    setAppliedFilters(defaults);
  };


  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const openServiceModal = (service) => {
    setSelectedService(service);
    setIsServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setIsServiceModalOpen(false);
    setSelectedService(null);
  };

  return (
    <>
      {/* MODAL */}
      {selectedItem && (
        <MenuItemDetailsModal item={selectedItem} isOpen={isModalOpen} onClose={closeModal} />
      )}
      {selectedService && (
        <CateringServiceModal serviceDetails={selectedService} isOpen={isServiceModalOpen} onClose={closeServiceModal} />
      )}

      {/* READILY AVAILABLE SERVICES BAR */}
      <div 
        className="bg-gradient-to-r cursor-pointer from-blue-100 via-blue-50 to-blue-100 shadow-md px-6 py-4 border border-blue-200">
        <h2 className="text-lg md:text-xl font-bold text-blue-700 mb-3 text-center md:text-left">
          ⭐ Readily Available Services
        </h2>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-blue-500 text-blue-700 px-4 py-2 rounded-sm flex items-center gap-2 hover:bg-blue-100 hover:shadow transition-all"
              onClick={() => openServiceModal(service)} // <-- Add this line
            >
              <span className="font-medium text-sm md:text-base">{service.name}</span>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row min-h-screen bg-white text-gray-700 pt-4"
        >
          {/* Mobile Filters */}
          <div className="md:hidden p-4 bg-white shadow flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-blue-600 font-semibold"
            >
              <FiFilter className="mr-2 text-xl" />
              Filters
            </button>
          </div>

          {/* Sidebar Filters */}
          <div className="md:w-1/4 w-full">
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden p-4 bg-white shadow-md border-b border-gray-200"
                >
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    applyFilters={applyFilters}
                    resetFilters={resetFilters}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="hidden md:block p-6 bg-white shadow-md rounded-md border border-gray-200 h-screen sticky top-0 overflow-hidden">
              <Filters
                filters={filters}
                setFilters={setFilters}
                applyFilters={applyFilters}
                resetFilters={resetFilters}
              />
            </div>
          </div>

          {/* Menu Cards */}
          <motion.div
            layout
            className="md:w-3/4 w-full p-4 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: "calc(100vh - 2rem)" }}
          >
            { loading ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <Lottie
                  animationData={loadinglottie}
                  loop={true}
                  style={{ width: 50, height: 50 }}
                />
              </div>
            ) : filteredItems.length === 0 ? (
                <p className="w-full text-center text-lg text-gray-600">
                  No menu items found.
                </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item)=>{
                  return(
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="bg-white max-h-95 rounded-lg shadow hover:shadow-xl transition flex flex-col"
                    >
                      <div className="relative">
                        <Image
                          src={item.image_data}
                          alt={item.name}
                          width={400}
                          height={250}
                          className="rounded-t-lg object-cover w-full h-48"
                        />
                        {item?.rating > 4.7 && (
                          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-white px-2 py-1 rounded">
                            Top Rated
                          </span>
                        )}
                      </div>

                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <p className="text-sm italic text-gray-600">{item.description}</p>
                          <p className="text-sm mt-1">⭐ {item.rating} | ₹{item.price}</p>
                        </div>

                        <div className="mt-auto pt-4 flex justify-between gap-2">
                          <button
                            className="bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition flex-1"
                            onClick={() => openModal(item)}
                          >
                            View Details
                          </button>
                          <button
                            className="bg-green-600 text-white text-sm py-2 px-4 rounded hover:bg-green-700 transition flex-1"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default CateringMenu;
