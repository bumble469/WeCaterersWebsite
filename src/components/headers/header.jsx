'use client';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/images/logo.png';

const Header = () => {
  return (
    <div className="bg-white flex flex-col md:flex-row items-center gap-x-12 p-2">
      <Link href="/">
        <Image
          src={logo}
          className="h-15 w-auto pb-4 cursor-pointer"
          alt="Logo"
        />
      </Link>
      <nav className="flex text-lg text-gray-700 gap-x-12 z-10">
        <Link href="/">
          Home
        </Link>
      </nav>
    </div>
  );
};

export default Header;
