'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CatererDashboardMenu = () => {
  const [menuItems, setMenuItems] = useState([
    {
      id: 'MNU001',
      name: 'Grilled Chicken Salad',
      description: 'A fresh and healthy salad with grilled chicken breast.',
      price: '$12.99',
      available: true,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 'MNU002',
      name: 'Vegetarian Lasagna',
      description: 'Layered pasta with a mix of vegetables and rich cheese.',
      price: '$14.99',
      available: true,
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 'MNU003',
      name: 'Chocolate Cake',
      description: 'Decadent chocolate cake with creamy frosting.',
      price: '$6.99',
      available: true,
      imageUrl: 'https://via.placeholder.com/150',
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const handleAddItem = (newItem) => {
    setMenuItems([...menuItems, newItem]);
  };

  const handleEditItem = (id, updatedItem) => {
    const updatedMenu = menuItems.map((item) =>
      item.id === id ? { ...item, ...updatedItem } : item
    );
    setMenuItems(updatedMenu);
  };

  const handleDeleteItem = (id) => {
    const updatedMenu = menuItems.filter((item) => item.id !== id);
    setMenuItems(updatedMenu);
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <motion.div className="flex justify-between items-center">
      <motion.div className="flex flex-col">
        <motion.h2
          className="text-2xl font-semibold text-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Menu Management
        </motion.h2>

        <motion.p
          className="text-gray-600 text-base mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Manage your catering menu items, including adding, editing, and deleting.
        </motion.p>
      </motion.div>

      {/* Button section */}
      <div className="flex justify-end mb-4">
        <motion.button
          onClick={() => setShowForm(!showForm)}
          className={`py-2 px-4 text-white ${
            showForm ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } rounded-sm`}
          whileTap={{ scale: 0.95 }}
        >
          {showForm ? 'Cancel' : 'Add New Item'}
        </motion.button>
      </div>
    </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            className="mb-6 p-4 text-gray-300 rounded-lg shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Add New Menu Item</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const newItem = {
                  id: `MNU00${menuItems.length + 1}`,
                  name: e.target.name.value,
                  description: e.target.description.value,
                  price: e.target.price.value,
                  available: true,
                  imageUrl: e.target.imageUrl.value || 'https://via.placeholder.com/150',
                };
                handleAddItem(newItem);
                e.target.reset();
                setShowForm(false);
              }}
            >
              <div className="flex space-x-4 mb-4">
                <input type="text" name="name" placeholder="Item Name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600" />
                <input type="text" name="price" placeholder="Price" required className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600" />
              </div>
              <textarea name="description" placeholder="Item Description" rows="2" required className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-gray-600" />
              <input type="url" name="imageUrl" placeholder="Image URL (Optional)" className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-gray-600" />
              <button type="submit" className="w-full py-2 px-4 text-white bg-green-500 rounded-lg hover:bg-green-600">
                Add Item
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Items List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <AnimatePresence>
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 flex flex-col justify-between h-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xl font-semibold text-gray-800">{item.name}</h4>
                <p className="text-lg font-semibold text-gray-700">{item.price}</p>
              </div>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <div className="flex justify-between items-center mt-auto">
                <button
                  onClick={() =>
                    handleEditItem(item.id, { ...item, price: '$15.99', name: `${item.name} (Updated)` })
                  }
                  className="py-1 px-3 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="py-1 px-3 text-white bg-red-500 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CatererDashboardMenu;
