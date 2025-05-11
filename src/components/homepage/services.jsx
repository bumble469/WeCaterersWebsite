import React from 'react';
import { FaUtensils, FaTruck, FaConciergeBell } from 'react-icons/fa';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const ServicesSection = () => {
  const services = [
    {
      icon: <FaUtensils className="text-blue-600 text-4xl mb-4" />,
      title: 'Custom Catering',
      description: 'Delicious, personalized menus tailored for your special occasions and dietary needs.',
    },
    {
      icon: <FaTruck className="text-blue-600 text-4xl mb-4" />,
      title: 'Fast Delivery',
      description: 'On-time delivery with hot and fresh meals straight to your venue.',
    },
    {
      icon: <FaConciergeBell className="text-blue-600 text-4xl mb-4" />,
      title: 'On-site Staff',
      description: 'Professional serving staff to handle everything so you can enjoy your event stress-free.',
    },
  ];

  return (
    <section id="services" className="h-screen">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">
            We provide a range of catering solutions designed to elevate any event, big or small.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={variants}
              initial="hidden"
              animate="enter"
              exit="exit"
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white shadow-md p-6 rounded-xl hover:shadow-xl transition flex flex-col items-center"
            >
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
