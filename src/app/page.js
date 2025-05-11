"use client";
import Image from 'next/image';
import { useState } from 'react';
import logo from '../assets/images/logo.png';
import landingpageimage from '../assets/images/landingpageimage.jpg';
import AuthComponent from '@/components/homepage/auth';
import AboutSection from '@/components/homepage/about';
import ContactSection from '@/components/homepage/contact';
import ServicesSection from '@/components/homepage/services';
import homelogin from '@/assets/images/home-login.jpg';
import homelcontact from '@/assets/images/home-contact.jpg';
import homeservices from '@/assets/images/home-services.jpg';
import homeabout from '@/assets/images/home-about.jpg';
import homelottie from '@/assets/images/home-lottie.json';
import Lottie from 'lottie-react';

export default function Home() {
  const [activeSection, setActiveSection] = useState(null);

  const handleLinkClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="h-screen overflow-y-auto md:overflow-y-hidden bg-white flex flex-col sm:flex-row">
      {/* Left Section */}
      <div
        className={`transition-all duration-300 p-2 flex flex-col p-4 ${
          activeSection ? 'w-full md:w-[65%]' : 'w-full md:w-1/2'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center gap-x-12">
          <Image src={logo} className="h-15 w-auto pb-4 cursor-pointer" alt="Logo" onClick={()=>setActiveSection(null)} />
          <nav className="flex text-lg text-gray-700 gap-x-12 z-10">
            <a
              href="#about"
              className={`hover:text-blue-600 ${activeSection === 'about' ? 'text-red-600' : ''}`}
              onClick={() => handleLinkClick('about')}
            >
              About
            </a>
            <a
              href="#services"
              className={`hover:text-blue-600 ${activeSection === 'services' ? 'text-red-600' : ''}`}
              onClick={() => handleLinkClick('services')}
            >
              Services
            </a>
            <a
              href="#contact"
              className={`hover:text-blue-600 ${activeSection === 'contact' ? 'text-red-600' : ''}`}
              onClick={() => handleLinkClick('contact')}
            >
              Contact
            </a>
            <a
              href="#login"
              className={`hover:text-blue-600 ${activeSection === 'login' ? 'text-red-600' : ''}`}
              onClick={() => handleLinkClick('login')}
            >
              Login
            </a>
          </nav>
        </div>
        <div className="block md:hidden mt-4 transition-opacity duration-700 ease-in-out">
          <Image
            key={activeSection} // This forces re-mount on section change
            src={
              activeSection === 'login'
                ? homelogin
                : activeSection === 'about'
                ? homeabout
                : activeSection === 'contact'
                ? homelcontact
                : activeSection === 'services'
                ? homeservices
                : landingpageimage
            }
            alt="Landing Page"
            className="object-cover h-52 rounded-4xl transition-opacity duration-700 opacity-0 animate-fadeIn"
            priority
          />
        </div>

        <div className="flex flex-col justify-center pt-8 md:h-full my-8 md:overflow-y-auto">
          {!activeSection && (
            <div className='flex flex-col items-center mt-6 md:mt-0 md:items-start'>
              <div className='flex items-center gap-x-2'>
                <h1 className="headingfont text-4xl sm:text-5xl font-bold text-gray-900 mb-4">We Caterers</h1>
                <Lottie animationData={homelottie} className='h-24 w-auto pb-6'/>
              </div>
              <p className="text-md sm:text-lg text-gray-600 italic mb-4">
                “Delivering excellence, one plate at a time.”
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                We are dedicated to crafting memorable dining experiences with fresh, high-quality ingredients. Whether it's a grand celebration or an intimate gathering, our team ensures every detail is perfect.
              </p>
              <p className="text-sm sm:text-base text-gray-500 italic mt-2">
                "Your satisfaction is our commitment – from the first bite to the last."
              </p>
            </div>
          )}

          {/* Render the active section below the title */}
          {activeSection === 'about' && <AboutSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'contact' && <ContactSection />}
          {activeSection === 'login' && <AuthComponent />}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="hidden md:w-1/2 md:block w-full h-64 sm:h-auto relative overflow-hidden rounded-tl-[20rem] transition-opacity duration-700 ease-in-out">
        <Image
          key={activeSection} // Trigger re-animation on change
          src={
            activeSection === 'login'
              ? homelogin
              : activeSection === 'about'
              ? homeabout
              : activeSection === 'contact'
              ? homelcontact
              : activeSection === 'services'
              ? homeservices
              : landingpageimage
          }
          alt="Landing Page"
          fill
          className="object-cover transition-opacity duration-700 opacity-0 animate-fadeIn"
          priority
        />
      </div>
    </div>
  );
}
