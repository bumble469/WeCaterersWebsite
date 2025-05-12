'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import logo from '@/assets/images/logo1.png';

const Header = ({ links, setActiveTab, activeTab }) => {
  return (
    <motion.div
      className='flex absolute items-center top-6 right-5 left-5 md:top-10 md:right-20 md:left-20 h-16'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className='flex h-20 md:h-24 w-auto bg-white rounded-xl items-center px-1 transform transition-all duration-300 ease-in-out shadow-md hover:shadow-lg'
        transition={{ duration: 0.3 }}
      >
        <Link href="/">
          <Image
            src={logo}
            className="h-28 md:h-34 w-auto cursor-pointer transition-all duration-300 ease-in-out transform"
            alt="Logo"
          />
        </Link>
      </motion.div>

      <motion.div
        className="bg-white rounded-r-full flex items-center gap-x-12 px-4 w-full h-[75%] transform transition-all duration-300 ease-in-out shadow-md hover:shadow-lg overflow-x-auto sm:overflow-x-auto"
        transition={{ duration: 0.3 }}
      >
        <nav className="flex text-xs md:text-[1.2vw] text-gray-700 gap-x-6 h-full items-center">
          {links.map((link, index) => {
            const isActive = activeTab && link.tab === activeTab;
            return (
              <Link
                href={link.route}
                key={index}
                onClick={() => {
                  if (setActiveTab && link.tab) {
                    setActiveTab(link.tab);
                  }
                }}
                className={`h-full flex items-center gap-2 px-6 py-2 transition-all duration-300 ease-in-out ${
                  isActive ? 'bg-red-400 text-gray-100' : 'hover:bg-red-400 hover:text-gray-100'
                }`}
              >
                {link.icon && <span className="text-lg">{link.icon}</span>}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </motion.div>
  );
};

export default Header;
