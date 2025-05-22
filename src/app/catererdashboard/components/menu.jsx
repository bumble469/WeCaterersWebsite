'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast for notifications
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import loadingicon from "../../../assets/images/loadingicon.json";

const CatererDashboardMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
  });

  const refreshTokenIfNeeded = async () => {
    try {
      await axios.post('/api/auth/caterer/refreshtoken', { withCredentials: true });
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data || error.message);
      toast.error('Session expired. Please log in again.');
      throw new Error('Token refresh failed');
    }
  };

  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      await refreshTokenIfNeeded();
      const response = await axios.get('/api/caterer/menu', { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        setMenuItems(response.data);
      }
    } catch (err) {
      toast.error('Failed to fetch menu items');
      console.error(err);
    } finally{
      setIsLoading(false);
    }
  };

  const handleAddItem = async (newItem) => {
    try {
      await refreshTokenIfNeeded();
      const response = await axios.post('/api/caterer/menu', newItem, { withCredentials: true });

      if (response.status === 200 || response.status === 201) {
        toast.success('Menu item added successfully!', {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        fetchMenuItems();
        setShowForm(false);
      }
    } catch (err) {
      toast.error('Failed to add item');
      console.error(err);
    }
  };

  const handleEditMenu = async (menuid, menuData) => {
    try {
      await refreshTokenIfNeeded();

      let base64Image = menuData.image;
      if (menuData.imageFile) {
        base64Image = await toBase64(menuData.imageFile);
      }

      const response = await axios.put('/api/caterer/menu', {
        menuid,
        name: menuData.name,
        description: menuData.description,
        price: parseFloat(menuData.price),
        cuisinetype: menuData.cuisinetype,
        dietarypreference: menuData.dietarypreference,
        image: base64Image,
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success("Menu updated!", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        fetchMenuItems();
      } else {
        toast.error("Could not update menu!", {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
      }
    } catch (err) {
      console.error('Error editing menu:', err);
      toast.error("Error updating menu.");
    }
  };

  const handleDeleteMenu = async (menuid) => {
    try {
      await refreshTokenIfNeeded();

      const response = await axios.delete('/api/caterer/menu', {
        data: { menuid },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Menu Item deleted successfully!', {
          autoClose: 1000,
          hideProgressBar: true,
        });
        fetchMenuItems();
      } else {
        toast.error('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Error deleting menu item');
    } finally {
      setShowDeleteConfirm(null);
    }
  };


  const handleImageUpload = (file, setFieldValue) => {
    setIsImageLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFieldValue(reader.result); // base64 string
      setImagePreview(reader.result); // for preview
      setIsImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      {isLoading == 0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Lottie animationData={loadingicon} loop={true} style={{ height: 50 }} />
        </div>
      ):(
        <>
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

            <div className="flex justify-end mb-4">
              <motion.button
                onClick={() => {
                  setShowForm(!showForm);
                  setImagePreview('');
                }}
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
                className="mb-6 p-4 text-gray-700 rounded-lg shadow-sm bg-gray-50"
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
                      imageUrl: imagePreview,
                      cuisinetype: e.target.cuisinetype.value,
                      dietarypreference: e.target.dietarypreference.value,
                    };
                    handleAddItem(newItem);
                    e.target.reset();
                    setImagePreview('');
                  }}
                >
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Item Name"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
                    />
                    <input
                      type="text"
                      name="price"
                      placeholder="Price"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
                    />
                  </div>
                  <textarea
                    name="description"
                    placeholder="Item Description"
                    rows="2"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-gray-600"
                  />
                  <div className="flex space-x-4 mb-4">
                    <input
                      type="text"
                      name="cuisinetype"
                      placeholder="Cuisine Type"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
                    />
                    <input
                      type="text"
                      name="dietarypreference"
                      placeholder="Dietary Preference"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-600"
                    />
                  </div>
                  <div className="mb-4 bg-gray-100 border cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-bg duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleImageUpload(e.target.files[0], setImagePreview);
                        }
                      }}
                      className="block w-full text-gray-600 cursor-pointer"
                    />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isImageLoading}
                    className={`w-full py-2 px-4 text-white rounded-lg ${
                      isImageLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isImageLoading ? 'Uploading Image...' : 'Add Item'}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {menuItems.length === 0 && (
                <p className='items-center text-gray-500'>No menu items found.</p>
              )}
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
                    src={item.image_data}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xl font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-lg font-semibold text-gray-700">{item.price}</p>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                  <p className="text-xs text-gray-500 mb-1">Cuisine: {item.cuisinetype || 'N/A'}</p>
                  <p className="text-xs text-gray-500 mb-4">Diet: {item.dietarypreference || 'N/A'}</p>
                  <div className="flex justify-between items-center mt-auto">
                    <button
                      onClick={() => setEditingMenu(item)}
                      className="py-1 px-3 cursor-pointer text-white bg-yellow-500 rounded-lg hover:bg-yellow-600"
                    >
                      Edit            
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(item)} // pass the whole item here
                      className="py-1 px-3 cursor-pointer text-white bg-red-500 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>

                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <AnimatePresence>
          {editingMenu && (
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-opacity-40 backdrop-blur-[2px] flex justify-center items-center z-50 overflow-y-auto"        >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md max-h-[90vh] custom-scrollbar overflow-y-auto"          >
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Menu Item</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await handleEditMenu(editingMenu.menuid, editingMenu);
                    setEditingMenu(null);
                  }}
                  className="space-y-3 text-gray-700"
                >
                  <input
                    className="border p-2 w-full rounded"
                    type="text"
                    placeholder="Name"
                    value={editingMenu.name}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, name: e.target.value })
                    }
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    type="text"
                    placeholder="Description"
                    value={editingMenu.description}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, description: e.target.value })
                    }
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    type="number"
                    placeholder="Price"
                    value={editingMenu.price}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, price: e.target.value })
                    }
                    required
                    min="0"
                    step="0.01"
                  />
                  <input
                    className="border p-2 w-full rounded"
                    type="text"
                    placeholder="Cuisine Type"
                    value={editingMenu.cuisinetype}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, cuisinetype: e.target.value })
                    }
                    required
                  />
                  <input
                    className="border p-2 w-full rounded"
                    type="text"
                    placeholder="Dietary Preference"
                    value={editingMenu.dietarypreference}
                    onChange={(e) =>
                      setEditingMenu({ ...editingMenu, dietarypreference: e.target.value })
                    }
                    required
                  />

                  {/* Image Upload */}
                  <div className="p-4 bg-white rounded-lg shadow-md max-w-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="block w-full text-sm text-gray-600
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const previewURL = URL.createObjectURL(file);
                          setEditingMenu({
                            ...editingMenu,
                            imageFile: file,
                            imagePreview: previewURL,
                          });
                        }
                      }}
                    />
                    {editingMenu.imagePreview && (
                      <div className="mt-4">
                        <span className="block text-sm text-gray-500 mb-1">Preview:</span>
                        <img
                          src={editingMenu.imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded border border-gray-300"
                        />
                      </div>
                    )}
                  </div>


                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => setEditingMenu(null)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-100 cursor-pointer"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                key="delete-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-opacity-40 backdrop-blur-[2px] flex justify-center items-center z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm"
                >
                  <p className="text-gray-800 text-lg mb-4">
                    Are you sure you want to delete{' '}
                    <strong>{showDeleteConfirm.name}</strong>?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 bg-gray-300 rounded text-gray-600 hover:bg-gray-400 transition duration-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteMenu(showDeleteConfirm.menuid)
                        setShowDeleteConfirm(null);
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-100 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </>
      )}
    </section>
  );
};

export default CatererDashboardMenu;
