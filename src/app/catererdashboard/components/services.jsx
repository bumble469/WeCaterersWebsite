'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CatererDashboardServices = () => {
  const [services, setServices] = useState([
    {
      id: 'SVC001',
      name: 'Wedding Reception',
      description: 'Elegant and exquisite catering services for weddings.',
      price: '$3000',
      capacity: 'Up to 200 guests',
      available: true,
    },
    {
      id: 'SVC002',
      name: 'Corporate Lunch',
      description: 'Professional catering for corporate events and lunches.',
      price: '$1500',
      capacity: 'Up to 50 guests',
      available: true,
    },
    {
      id: 'SVC003',
      name: 'Birthday Party',
      description: 'Fun and vibrant catering for birthday parties.',
      price: '$1000',
      capacity: 'Up to 30 guests',
      available: false,
    },
    {
      id: 'SVC004',
      name: 'Buffet Setup',
      description: 'Complete buffet setup with food stations for large events.',
      price: '$2500',
      capacity: 'Up to 100 guests',
      available: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: '',
    capacity: '',
    available: true,
  });

  const handleAddService = (service) => {
    const newId = `SVC${services.length + 1}`.padStart(6, '0');
    setServices([...services, { ...service, id: newId }]);
    setNewService({
      name: '',
      description: '',
      price: '',
      capacity: '',
      available: true,
    });
    setShowForm(false);
  };

  const handleEditService = (id, updatedService) => {
    setServices(services.map(service => (service.id === id ? updatedService : service)));
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Manage Catering Services</h2>
            <p className="text-sm text-gray-500">Add, edit, or remove services offered for your events.</p>
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
                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded text-gray-600"
                type="text"
                placeholder="Description"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded text-gray-600"
                type="text"
                placeholder="Price"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                required
              />
              <input
                className="border p-2 rounded text-gray-600"
                type="text"
                placeholder="Capacity"
                value={newService.capacity}
                onChange={(e) => setNewService({ ...newService, capacity: e.target.value })}
                required
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={newService.available}
                  onChange={(e) => setNewService({ ...newService, available: e.target.checked })}
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
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-${service.available ? 'green' : 'gray'}-50 rounded-lg p-4 border-2 border-${service.available ? 'green' : 'gray'}-300 flex flex-col`}
            >
              <h3 className="text-xl font-semibold text-gray-800">{service.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{service.description}</p>
              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-700">{service.price}</p>
                <p className="text-sm text-gray-500">{service.capacity}</p>
              </div>
              <div className="flex-grow"></div>
              <div className="flex justify-between mt-4 space-x-4">
                <button
                  className="py-1 px-3 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
                  onClick={() => {
                    const updatedService = {
                      ...service,
                      price: '$3500',
                      available: !service.available,
                    };
                    handleEditService(service.id, updatedService);
                  }}
                >
                  Edit
                </button>
                <button
                  className="py-1 px-3 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleDeleteService(service.id)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CatererDashboardServices;
