"use client";
import Image from 'next/image';
import { useState } from 'react';
import logo from '../assets/images/logo.png';
import landingpageimage from '../assets/images/landingpageimage.jpg';
import AuthComponent from '@/components/homepage/auth';
import AboutSection from '@/components/homepage/about';
import ContactSection from '@/components/homepage/contact';
import ServicesSection from '@/components/homepage/services';

export default function Home() {
  const [activeSection, setActiveSection] = useState(null);

  const handleLinkClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="h-screen overflow-auto md:overflow-hidden bg-white flex flex-col sm:flex-row">
      {/* Left Section */}
      <div
        className={`transition-all duration-300 p-2 flex flex-col p-4 ${
          activeSection ? 'sm:w-[65%]' : 'sm:w-1/2'
        }`}
      >
        <div className="flex items-center gap-x-6">
          <Image src={logo} className="h-15 w-auto pb-4" alt="Logo" />
          <nav className="flex items-center text-lg text-gray-700 gap-x-6">
            <a
              href="#about"
              className="hover:text-blue-600"
              onClick={() => handleLinkClick('about')}
            >
              About
            </a>
            <a
              href="#services"
              className="hover:text-blue-600"
              onClick={() => handleLinkClick('services')}
            >
              Services
            </a>
            <a
              href="#contact"
              className="hover:text-blue-600"
              onClick={() => handleLinkClick('contact')}
            >
              Contact
            </a>
            <a
              href="#login"
              className="hover:text-blue-600"
              onClick={() => handleLinkClick('login')}
            >
              Login
            </a>
          </nav>
        </div>

        <div className="flex flex-col justify-center pt-4 h-full mb-8 overflow-y-auto">
          {!activeSection && (
            <>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">We Caterers</h1>
              <p className="text-md sm:text-lg text-gray-600 italic">“Delivering excellence, one plate at a time.”</p>
            </>
          )}

          {/* Render the active section below the title */}
          {activeSection === 'about' && <AboutSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'contact' && <ContactSection />}
          {activeSection === 'login' && <AuthComponent />}
        </div>
      </div>

      {/* Right Section - Image */}
      <div className="sm:w-1/2 w-full h-64 sm:h-auto relative overflow-hidden rounded-tl-[20rem]">
        <Image
          src={landingpageimage}
          alt="Landing Page"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
