import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 40 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AboutSection = () => {
  return (
    <section id="about" className="p-4 flex flex-col justify-center items-center h-full">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto text-center w-full max-w-2xl"
      >
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-left">About Us</h2>
        <p className="text-md sm:text-lg text-gray-600 leading-relaxed text-justify">
          At <span className="font-semibold text-blue-600">We Caterers</span>, we specialize in delivering exceptional culinary experiences for every occasion.
          From intimate gatherings to grand celebrations, our team ensures that every dish is crafted with passion, precision, and premium ingredients.
          With a commitment to quality and customer satisfaction, we bring flavor and elegance to your events — one plate at a time.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
