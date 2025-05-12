"use client"
import Header from "@/components/headers/header";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import Filters from './components/filter';
import explorepageimage from '../../assets/images/explorepageimage.jpg';
import CatererDetailsModal from "./components/detailsmodal";

const Caterers = () => {
  const caterers = [
    { id: 1, name: 'Royal Feasts', image: '/caterer1.jpg', tagline: "Luxury catering for royal events", rating: 4.8, eventType: 'Wedding', price: '₹1000+', location: 'Delhi' },
    { id: 2, name: 'Urban Tastes', image: '/caterer2.jpg', tagline: "Trendy menus for modern occasions", rating: 4.5, eventType: 'Corporate', price: '₹500 - ₹1000', location: 'Mumbai' },
    { id: 3, name: 'Fiesta Flavors', image: '/caterer3.jpg', tagline: "Bold flavors, vibrant celebrations", rating: 4.7, eventType: 'Birthday', price: '₹200 - ₹500', location: 'Bengaluru' },
    { id: 4, name: 'Classic Caterers', image: '/caterer4.jpg', tagline: "Traditional menus with timeless taste", rating: 4.2, eventType: 'Wedding', price: '₹500 - ₹1000', location: 'Kolkata' },
    { id: 5, name: 'Spice Trail', image: '/caterer5.jpg', tagline: "Spicy delicacies across India", rating: 4.6, eventType: 'Festivals', price: '₹200 - ₹500', location: 'Chennai' },
    { id: 6, name: 'Taste Buds', image: '/caterer6.jpg', tagline: "Delight your senses", rating: 4.4, eventType: 'Buffet', price: '₹500 - ₹1000', location: 'Hyderabad' },
    { id: 7, name: 'Gastronome', image: '/caterer7.jpg', tagline: "Gourmet meals for any event", rating: 4.9, eventType: 'Wedding', price: '₹1000+', location: 'Pune' },
    { id: 8, name: 'Flavors of India', image: '/caterer8.jpg', tagline: "Authentic Indian flavors", rating: 4.3, eventType: 'Corporate', price: '₹200 - ₹500', location: 'Delhi' },
    { id: 9, name: 'Savor Moments', image: '/caterer9.jpg', tagline: "Savor the best moments of life", rating: 4.6, eventType: 'Birthday', price: '₹500 - ₹1000', location: 'Goa' },
    { id: 10, name: 'The Feast Makers', image: '/caterer10.jpg', tagline: "Creating feasts that leave an impression", rating: 4.5, eventType: 'Buffet', price: '₹1000+', location: 'Jaipur' },
    { id: 11, name: 'Savory Spice', image: '/caterer11.jpg', tagline: "Spicy flavors for spice lovers", rating: 3.9, eventType: 'Festivals', price: '₹500 - ₹1000', location: 'Lucknow' },
    { id: 12, name: 'Delight Catering', image: '/caterer12.jpg', tagline: "Delighting your guests with each bite", rating: 4.8, eventType: 'Wedding', price: '₹200 - ₹500', location: 'Ahmedabad' },
    { id: 13, name: 'Bountiful Banquets', image: '/caterer13.jpg', tagline: "Banquet-style catering for grand events", rating: 3.1, eventType: 'Corporate', price: '₹1000+', location: 'Bengaluru' },
    { id: 14, name: 'Vibrant Feasts', image: '/caterer14.jpg', tagline: "Vibrant food for vibrant occasions", rating: 4.6, eventType: 'Birthday', price: '₹500 - ₹1000', location: 'Chandigarh' },
    { id: 15, name: 'Zest Catering', image: '/caterer15.jpg', tagline: "Adding zest to your event", rating: 4.3, eventType: 'Buffet', price: '₹500 - ₹1000', location: 'Indore' },
    { id: 16, name: 'Spice Garden', image: '/caterer16.jpg', tagline: "Spicy, fresh, and authentic", rating: 4.2, eventType: 'Wedding', price: '₹500 - ₹1000', location: 'Surat' },
    { id: 17, name: 'Fusion Flavors', image: '/caterer17.jpg', tagline: "Fusion cuisine for all tastes", rating: 4.5, eventType: 'Corporate', price: '₹200 - ₹500', location: 'Gurugram' },
    { id: 18, name: 'Exquisite Events Catering', image: '/caterer18.jpg', tagline: "Exquisite catering for refined events", rating: 4.9, eventType: 'Wedding', price: '₹1000+', location: 'Noida' },
    { id: 19, name: 'Royal Spice', image: '/caterer19.jpg', tagline: "A royal touch to your event", rating: 4.8, eventType: 'Birthday', price: '₹200 - ₹500', location: 'Pune' },
    { id: 20, name: 'Tandoor Tales', image: '/caterer20.jpg', tagline: "Tandoor delicacies that speak for themselves", rating: 3.5, eventType: 'Buffet', price: '₹500 - ₹1000', location: 'Kolkata' }
  ];

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    eventType: "All",
    rating: "All",
    price: "All",
    location: "",
  });
  const [filteredCaterers, setFilteredCaterers] = useState(caterers);
  const [isCatererDetailsModalOpen, setIsCatererDetailsModalOpen] = useState(false);
  const [selectedCaterer, setSelectedCaterer] = useState(null);

  const applyFilters = () => {
    let result = caterers;

    // Filter by Event Type
    if (filters.eventType !== "All") {
      result = result.filter(c => c.eventType === filters.eventType);
    }

    // Filter by Rating
    if (filters.rating !== "All") {
      const minRating =
        filters.rating === "4 stars & above" ? 4 :
        filters.rating === "3 stars & above" ? 3 : 0;
      result = result.filter(c => c.rating >= minRating);
    }

    if (filters.price !== "All") {
    result = result.filter(c => {
        if (filters.price === "₹200 - ₹500") {
          return c.price === "₹200 - ₹500"; 
        }
        if (filters.price === "₹500 - ₹1000") {
          return c.price === "₹500 - ₹1000";  
        }
        if (filters.price === "₹1000+") {
          return c.price === "₹1000+";  
        }
      });
    }

    if (filters.location.trim() !== "") {
      result = result.filter(c =>
        c.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setFilteredCaterers(result);
  };

  const resetFilters = () => {
    setFilters({ eventType: "All", rating: "All", price: "All", location: "" });
    setFilteredCaterers(caterers);
  };

  const links = [
    { name: 'Home', route: '/', icon:<FaHome/> },
  ];

  const handleViewDetails = (caterer) => {
    setSelectedCaterer(caterer);
    setIsCatererDetailsModalOpen(true);
  };

  return (
  <>
    {/* Image + Header Block */}
    <div className="relative w-full">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div
          className="w-full h-[400px] bg-fixed bg-center bg-cover bg-no-repeat"
          style={{ backgroundImage: `url(${explorepageimage.src})` }}
        ></div>

        {/* SVG Mask to create the rugged edge */}
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-white via-transparent to-transparent z-20">
          <svg
            className="absolute bottom-0 w-full"
            viewBox="0 0 1440 60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="white"
              d="M0,0 L100,15 L200,5 L300,35 L400,10 L500,30 L600,0 L700,25 L800,10 L900,20 L1000,15 L1100,30 L1200,5 L1300,25 L1400,0 L1440,10 L1440,60 L0,60 Z"
            />
          </svg>
        </div>
      </motion.div>
       <motion.div
        className="absolute top-1/2 left-10 md:left-15 lg:left-20 transform -translate-y-1/2 text-white z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-xl md:text-3xl lg:text-5xl font-bold">
          Explore the Caterers We Offer
        </h2>
        <p className="mt-2 text-sm md:text-lg lg:text-xl">Find the perfect caterer for your next event!</p>
      </motion.div>
      <Header links={links} />
    </div>

    {/* All other content starts below the image */}
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
          {/* Mobile collapsible filter */}
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

          {/* Desktop filter */}
          <div className="hidden md:block p-6 bg-white shadow-md rounded-md border border-gray-200 h-screen sticky top-0 overflow-hidden">
            <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} resetFilters={resetFilters} />
          </div>
        </div>

        {/* Caterer Cards */}
        <motion.div
            layout
            className="md:w-3/4 w-full p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar"
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          >
            {filteredCaterers.length === 0 ? (
              <p className="w-full text-center text-lg text-gray-600">
                No caterers found.
              </p>
            ) : (
              filteredCaterers.map(caterer => (
                <motion.div
                  key={caterer.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-lg shadow hover:shadow-xl transition flex flex-col"
                >
                  <div className="relative">
                    <Image
                      src={caterer.image}
                      alt={caterer.name}
                      width={400}
                      height={250}
                      className="rounded-t-lg object-cover w-full h-48"
                    />
                    {caterer.rating > 4.7 && (
                      <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-white px-2 py-1 rounded">
                        Top Rated
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg font-semibold">{caterer.name}</h3>
                      <p className="text-sm italic text-gray-600">{caterer.tagline}</p>
                      <p className="text-sm mt-1">
                        ⭐ {caterer.rating} | Starting from ₹500/plate
                      </p>
                    </div>
                    <div className="flex justify-between mt-4 gap-2">
                      <button
                        onClick={() => handleViewDetails(caterer)}
                        className="bg-blue-600 text-white text-sm py-2 px-4 rounded hover:bg-blue-700 transition flex-1"
                      >
                        View Details
                      </button>
                      <button
                        className="bg-green-600 text-white text-sm py-2 px-4 rounded hover:bg-green-700 transition flex-1"
                      >
                        Order From
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
      </motion.div>
    </AnimatePresence>
    <CatererDetailsModal
      isOpen={isCatererDetailsModalOpen}
      caterer={selectedCaterer}
      onClose={() => setIsCatererDetailsModalOpen(false)}
    />
  </>
  );

};

export default Caterers;
