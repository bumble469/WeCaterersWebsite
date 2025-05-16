'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEdit, FaBan } from 'react-icons/fa';

const AdminCaterers = () => {
  const [search, setSearch] = useState('');

  const caterers = [
    { id: 1, name: 'Delish Bites', email: 'contact@delish.com', service: 'Veg & Non-Veg', status: 'Active' },
    { id: 2, name: 'Spice Kitchen', email: 'spice@kitchen.com', service: 'Veg Only', status: 'Pending' },
    { id: 3, name: 'Royal Caterers', email: 'info@royalcaterers.com', service: 'Non-Veg Only', status: 'Suspended' },
    { id: 4, name: 'Urban Treats', email: 'urbantreats@cater.com', service: 'All Types', status: 'Active' },
  ];

  const filteredCaterers = caterers.filter(caterer =>
    caterer.name.toLowerCase().includes(search.toLowerCase()) ||
    caterer.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Caterers</h2>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4 bg-white rounded-md px-4 py-2 shadow-sm max-w-md">
        <FaSearch className="text-gray-500" />
        <input
          type="text"
          placeholder="Search caterers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="outline-none w-full bg-transparent text-gray-500"
        />
      </div>

      {/* Caterers Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Service Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCaterers.length > 0 ? (
              filteredCaterers.map((caterer, index) => (
                <motion.tr
                  key={caterer.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{caterer.name}</td>
                  <td className="px-6 py-4 text-gray-800">{caterer.email}</td>
                  <td className="px-6 py-4 text-gray-800">{caterer.service}</td>
                  <td className={`px-6 py-4 font-semibold ${caterer.status === 'Active' ? 'text-green-600' : caterer.status === 'Suspended' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {caterer.status}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaBan />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4 text-gray-500 italic" colSpan="5">
                  No caterers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default AdminCaterers;
