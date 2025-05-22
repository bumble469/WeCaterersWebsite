'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import logo from '../assets/images/logo1.png';
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
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function Home() {
  const [activeSection, setActiveSection] = useState(null);

  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/userdashboard?user=guest');
  };

  const handleLinkClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="h-screen overflow-y-auto md:overflow-y-hidden bg-white flex flex-col sm:flex-row">
      <div
        className={`transition-all duration-300 p-2 flex flex-col p-4 ${
          activeSection ? 'w-full md:w-[65%]' : 'w-full md:w-1/2'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center gap-x-12">
          <Image src={logo} className="h-28 w-auto cursor-pointer -m-4" alt="Logo" onClick={() => setActiveSection(null)} />
          <nav className="flex text-sm md:text-lg text-gray-700 gap-x-6 md:gap-x-12 z-10">
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
            key={activeSection}
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

        <div className="flex custom-scrollbar flex-col justify-center pt-8 md:h-full my-8 md:overflow-y-auto">
          {!activeSection && (
            <div className="flex flex-col items-center px-4 md:mt-0 md:items-start">
              <div className="flex items-center gap-x-2">
                <h1 className="headingfont text-4xl sm:text-5xl font-bold text-gray-900 mb-1">We Caterers</h1>
                <Lottie animationData={homelottie} className="h-24 w-auto pb-6" />
              </div>
              <button
                onClick={handleExploreClick}
                className="mb-3 text-center w-1/2 py-2 px-4 text-gray-700 border cursor-pointer transition duration-200 hover:scale-103"
              >
                Explore
              </button>
              <p className="text-md sm:text-lg text-gray-600 italic mb-4">
                &quot;Delivering excellence, one plate at a time.&quot;
              </p>
              <p className="text-sm sm:text-base text-gray-500">
                We are dedicated to crafting memorable dining experiences with fresh, high-quality ingredients. Whether it&apos;s a grand celebration or an intimate gathering, our team ensures every detail is perfect.
              </p>
              <p className="text-sm sm:text-base text-gray-500 italic mt-2">
                &quot;Your satisfaction is our commitment – from the first bite to the last.&quot;
              </p>
            </div>
          )}

          {activeSection === 'about' && <AboutSection />}
          {activeSection === 'services' && <ServicesSection />}
          {activeSection === 'contact' && <ContactSection />}
          {activeSection === 'login' && <AuthComponent />}
        </div>
      </div>

      <div className="hidden md:w-1/2 md:block w-full h-64 sm:h-auto relative overflow-hidden rounded-tl-[20rem] transition-opacity duration-700 ease-in-out">
        <Image
          key={activeSection} 
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
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-700 opacity-0 animate-fadeIn"
          priority
        />
      </div>
    </div>
  );
}
