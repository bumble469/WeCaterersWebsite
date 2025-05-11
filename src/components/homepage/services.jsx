import React from 'react';
import { FaUtensils, FaTruck, FaConciergeBell } from 'react-icons/fa';

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
    <section id="services" className="p-2 mt-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          We provide a range of catering solutions designed to elevate any event, big or small.
        </p>
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div key={index} className="bg-white shadow-md p-8 rounded-xl hover:shadow-xl transition">
              {service.icon}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
