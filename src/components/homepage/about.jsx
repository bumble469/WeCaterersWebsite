import React from 'react';
import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 40 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AboutSection = () => {
  return (
    <section id="about" className="flex flex-col items-center min-h-screen px-4 md:py-12 md:mt-12">
      <motion.div
        variants={variants}
        initial="hidden"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto text-center w-full max-w-2xl space-y-8"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 text-left">About Us</h2>
          <p className="text-md sm:text-lg text-gray-600 leading-relaxed text-justify">
            At <span className="font-semibold text-blue-600">We Caterers</span>, we specialize in delivering exceptional culinary experiences for every occasion.
            From intimate gatherings to grand celebrations, our team ensures that every dish is crafted with passion, precision, and premium ingredients.
            With a commitment to quality and customer satisfaction, we bring flavor and elegance to your events &mdash; one plate at a time.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md text-left">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Who We Are</h3>
          <p className="text-gray-700">
            We&rsquo;re a team of chefs, event planners, and hospitality professionals with years of experience in curating unforgettable dining moments.
            Our strength lies in our versatility, creativity, and deep understanding of our clients&rsquo; needs.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md text-left">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Mission</h3>
          <p className="text-gray-700">
            To redefine catering by combining innovation with tradition &mdash; offering food that not only tastes amazing but also creates lasting memories.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow-md text-left">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Why Choose Us?</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Premium ingredients and diverse menu options</li>
            <li>Attention to detail and elegant presentation</li>
            <li>Timely service and customer-first approach</li>
            <li>Customizable packages for any event size</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
