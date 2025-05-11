'use client';
import Header from "@/components/headers/header";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const Caterers = () => {
  const caterers = [
    { id: 1, name: 'Royal Feasts', image: '/caterer1.jpg', tagline: "Luxury catering for royal events", rating: 4.8 },
    { id: 2, name: 'Urban Tastes', image: '/caterer2.jpg', tagline: "Trendy menus for modern occasions", rating: 4.5 },
    { id: 3, name: 'Fiesta Flavors', image: '/caterer3.jpg', tagline: "Bold flavors, vibrant celebrations", rating: 4.7 },
    { id: 4, name: 'Classic Caterers', image: '/caterer4.jpg', tagline: "Traditional menus with timeless taste", rating: 4.2 },
    { id: 5, name: 'Spice Trail', image: '/caterer5.jpg', tagline: "Spicy delicacies across India", rating: 4.6 },
    { id: 6, name: 'Taste Buds', image: '/caterer6.jpg', tagline: "Delight your senses", rating: 4.4 },
  ];

  return (
    <>
      <Header />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-700"
        >
          {/* Sidebar Filters */}
          <div className="md:w-1/4 w-full p-6 bg-white shadow-md rounded-md border border-gray-200 h-screen sticky top-0 overflow-hidden">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Find the Right Caterer</h2>

            {/* Type Filter */}
            <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                🎉 Event Type
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>All</option>
                <option>Wedding</option>
                <option>Corporate</option>
                <option>Birthday</option>
                <option>Buffet</option>
                <option>Festivals</option>
                </select>
            </div>

            {/* Rating Filter */}
            <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                ⭐ Rating
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>All</option>
                <option>4 stars & above</option>
                <option>3 stars & above</option>
                <option>Below 3 stars</option>
                </select>
            </div>

            {/* Price Filter */}
            <div className="mb-5">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                💰 Price Range
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400">
                <option>All</option>
                <option>₹200 - ₹500</option>
                <option>₹500 - ₹1000</option>
                <option>₹1000+</option>
                </select>
            </div>

            {/* Location Filter */}
            <div className="mb-6">
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                📍 Location
                </label>
                <input
                type="text"
                className="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter city or area"
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-between gap-3 mt-6">
                <button className="w-1/2 bg-gray-100 text-gray-800 border border-gray-300 rounded py-2 hover:bg-gray-200 transition">
                Reset
                </button>
                <button className="w-1/2 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition">
                Apply
                </button>
            </div>
            </div>


          {/* Caterer Cards */}
          <motion.div
            layout
            className="md:w-3/4 w-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {caterers.map((caterer) => (
            <motion.div
                key={caterer.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-lg shadow hover:shadow-xl transition duration-300 border border-gray-100 flex flex-col"
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
                    <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold text-white px-2 py-1 rounded shadow">
                    Top Rated
                    </span>
                )}
                </div>

                {/* Card Content with flex-grow to push button down */}
                <div className="p-4 text-gray-700 flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="text-lg font-semibold">{caterer.name}</h3>
                    <p className="text-sm italic text-gray-600">{caterer.tagline}</p>
                    <p className="text-sm mt-1">⭐ {caterer.rating} | Starting from ₹500/plate</p>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                    View Details
                </button>
                </div>
            </motion.div>
            ))}

          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Caterers;
