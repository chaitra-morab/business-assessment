'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useAssessmentModal } from '@/components/ModalProvider';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openModal } = useAssessmentModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-slate-800 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Brand */}
        <Link href="/" className="text-xl font-bold text-white">
          AI Assessment Tool
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
          <button
            type="button"
            className="hover:underline cursor-pointer bg-transparent border-none outline-none text-inherit"
            onClick={openModal}
          >
            Assessments
          </button>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/admin/login" className="hover:underline font-semibold text-yellow-300">Admin Dashboard</Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden w-8 h-8 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-slate-800 space-y-2 text-white">
          <Link href="/" className="block hover:underline" onClick={toggleMobileMenu}>Home</Link>
          <Link href="/about" className="block hover:underline" onClick={toggleMobileMenu}>About</Link>
          <button
            type="button"
            className="block w-full text-left hover:underline bg-transparent border-none outline-none text-inherit"
            onClick={() => { openModal(); toggleMobileMenu(); }}
          >
            Assessments
          </button>
          <Link href="/contact" className="block hover:underline" onClick={toggleMobileMenu}>Contact</Link>
          <Link href="/admin/login" className="block hover:underline font-semibold text-yellow-300" onClick={toggleMobileMenu}>Admin Dashboard</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
