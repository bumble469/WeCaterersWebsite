import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 40 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const ContactSection = () => {
  return (
    <section id="contact" className="bg-white p-2">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12"
      >
        {/* Contact Info */}
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            Have questions or want to book our catering service? We'd love to hear from you.
            Reach out via the form or use the contact details below.
          </p>
          <ul className="text-gray-700 space-y-4">
            <li>
              <span className="font-semibold">Email:</span> contact@wecaterers.com
            </li>
            <li>
              <span className="font-semibold">Phone:</span> +1 (123) 456-7890
            </li>
            <li>
              <span className="font-semibold">Location:</span> 123 Culinary Lane, Flavor Town
            </li>
          </ul>
        </div>

        {/* Contact Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border text-gray-700 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Message</label>
            <textarea
              rows="5"
              placeholder="Your message..."
              className="w-full border text-gray-700 border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Send Message
          </button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactSection;
