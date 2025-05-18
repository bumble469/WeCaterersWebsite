'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import Lottie from 'lottie-react';
import loadingicon from "../../../assets/images/loadingicon.json"

const CatererDashboardServices = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    availability: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/caterer/service', {
        withCredentials: true,
      });
      if (response.status === 200 || response.status === 201) {
        setServices(response.data);
      }
    } catch (err) {
      toast.error('Failed to fetch services');
      console.error(err);
    }
  };

  const handleAddService = async (service) => {
    try {
      const response = await axios.post('/api/caterer/service', service, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200) {
        toast.success('Service added successfully!', {
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        setNewService({
          name: '',
          description: '',
          price: '',
          capacity: '',
          availability: true, 
        });
        setShowForm(false);
        fetchServices();
      } else {
        toast.error('Could not add service');
      }
    } catch (error) {
      console.error('Add service error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || error.message);
    }
  };


  const handleEditService = async (serviceid, serviceData) => {
    try {
      const response = await fetch('/api/caterer/service', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          serviceid,
          name: serviceData.name,
          description: serviceData.description,
          price: parseFloat(serviceData.price),
          capacity: parseInt(serviceData.capacity),
          availability: serviceData.availability,
        }),
      });

      if (response.status == 200 || response.status == 201) {
        toast.success("Service updated!",{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        });
        fetchServices();
      } else {
        toast.error("Could not update service!",{
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
        })
      }
    } catch (err) {
      console.error('Error editing service:', err);
    }
  };


  const handleDeleteService = async (serviceid) => {
    try {
      const response = await axios.delete('/api/caterer/service', {
        data: { serviceid },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Service deleted successfully!', {
          autoClose: 1000,
          hideProgressBar: true,
        });
        fetchServices(); // Refresh the list after deletion
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      toast.error(error.response?.data?.error || 'Error deleting service');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      {services.length==0 ? (
        <div className="flex justify-center items-center h-[50vh]">
          <Lottie animationData={loadingicon} loop={true} style={{ height: 50 }} />
        </div>
      ) : (
        <>
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Manage Catering Services</h2>
              <p className="text-sm text-gray-500">
                Add, edit, or remove services offered for your events.
              </p>
            </div>
            <button
              className="transition-all duration-300 transform hover:scale-105 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : 'Add New Service'}
            </button>
          </div>

          <AnimatePresence>
            {showForm && (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="border-gray-300 border rounded-lg p-4 grid gap-3 md:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddService(newService);
                }}
              >
                <input
                  className="border p-2 rounded text-gray-600"
                  type="text"
                  placeholder="Service Name"
                  value={newService.name}
                  onChange={(e) =>
                    setNewService({ ...newService, name: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded text-gray-600"
                  type="text"
                  placeholder="Description"
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({ ...newService, description: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded text-gray-600"
                  type="text"
                  placeholder="Price"
                  value={newService.price}
                  onChange={(e) =>
                    setNewService({ ...newService, price: e.target.value })
                  }
                  required
                />
                <input
                  className="border p-2 rounded text-gray-600"
                  type="text"
                  placeholder="Capacity"
                  value={newService.capacity}
                  onChange={(e) =>
                    setNewService({ ...newService, capacity: e.target.value })
                  }
                  required
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newService.availability || false}
                    onChange={(e) =>
                      setNewService({ ...newService, availability: e.target.checked })
                    }
                  />
                  <label className="ml-2 text-sm text-gray-600">Available</label>
                </div>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded w-full md:w-auto transition-all duration-300 transform hover:scale-105"
                >
                  Submit
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {services.map((service) => (
              <motion.div
                key={service.serviceid}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-${service.availability ? 'green-50' : 'gray-100'} rounded-lg p-4 border-2 border-${service.availability ? 'green' : 'gray'}-300 flex flex-col`}
              >
                <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                  <span>{service.name}</span>
                  {Boolean(service.availability) == true ? (
                    <span className="text-green-500 text-sm font-semibold bg-green-100 px-2 py-0.5 rounded">Available</span>
                  ) : (
                    <span className="text-red-500 text-sm font-semibold bg-red-100 px-2 py-0.5 rounded">Not Available</span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                <div className="mt-4">
                  <p className="text-lg font-semibold text-gray-700">{service.price}</p>
                  <p className="text-sm text-gray-500">{service.capacity}</p>
                </div>
                <div className="flex-grow"></div>
                <div className="flex justify-between mt-4 space-x-4">
                  <button
                    className="py-1 px-3 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() =>
                      setEditingService({
                        ...service,
                        availability: Boolean(service.availability),
                      })
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="py-1 px-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    onClick={() => setShowDeleteConfirm(service)}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
            <AnimatePresence>
              {editingService && (
                <motion.div
                  key="edit-modal"
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
                    className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
                  >
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Edit Service</h2>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditService(editingService.serviceid, editingService);
                        setEditingService(null);
                      }}
                      className="space-y-3 text-gray-700"
                    >
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={editingService.name}
                        onChange={(e) =>
                          setEditingService({ ...editingService, name: e.target.value })
                        }
                        required
                      />
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={editingService.description}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            description: e.target.value,
                          })
                        }
                        required
                      />
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={editingService.price}
                        onChange={(e) =>
                          setEditingService({ ...editingService, price: e.target.value })
                        }
                        required
                      />
                      <input
                        className="border p-2 w-full rounded"
                        type="text"
                        value={editingService.capacity}
                        onChange={(e) =>
                          setEditingService({ ...editingService, capacity: e.target.value })
                        }
                        required
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingService.availability}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              availability: e.target.checked,
                            })
                          }
                        />
                        <label className="ml-2 text-gray-600">Available</label>
                      </div>
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setEditingService(null)}
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
                          handleDeleteService(showDeleteConfirm.serviceid);
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
          </AnimatePresence>
        </div>
      </>
    )}
  </motion.div>
  );
};

export default CatererDashboardServices;
