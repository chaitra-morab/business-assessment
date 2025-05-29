'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const toggleMenu = () => setMobileMenu(!mobileMenu);
  const closeMenu = () => setMobileMenu(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-gradient-to-r from-slate-800 via-slate-700 to-pink-600 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link href="/" className="text-xl font-bold text-white">AI Assessment Tool</Link>

        {/* Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/assessment" className="hover:underline">Assessments</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/login" className="hover:underline">Login</Link>
          <Link
            href="/signup"
            className="bg-white text-pink-600 px-4 py-1 rounded hover:bg-slate-100 font-semibold transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile toggle button */}
        <button onClick={toggleMenu} className="md:hidden w-8 h-8">
          {mobileMenu ? <XMarkIcon className="text-white" /> : <Bars3Icon className="text-white" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden px-4 pb-4 bg-gradient-to-r from-slate-800 via-slate-700 to-pink-600 space-y-2 text-white">
          <Link href="/" className="block hover:underline" onClick={closeMenu}>Home</Link>
          <Link href="/about" className="block hover:underline" onClick={closeMenu}>About</Link>
          <Link href="/assessment" className="block hover:underline" onClick={closeMenu}>Assessments</Link>
          <Link href="/contact" className="block hover:underline" onClick={closeMenu}>Contact</Link>
          <Link href="/login" className="block hover:underline" onClick={closeMenu}>Login</Link>
          <Link href="/signup" className="block hover:underline" onClick={closeMenu}>Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
