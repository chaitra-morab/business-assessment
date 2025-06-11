'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { authService } from '@/services/auth.service';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      const isAuth = authService.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        const user = authService.getCurrentUser();
        setUserName(user?.name || '');
      }
    };

    // Initial check
    checkAuth();

    // Listen for auth state changes
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  // Don't render anything until after mounting to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserName('');
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-slate-800 shadow-md text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between h-16 items-center">
        <Link href="/" className="text-xl font-bold text-white">AI Assessment Tool</Link>

        {/* Desktop */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/about" className="hover:underline">About</Link>
<<<<<<< HEAD
          <Link href="/assessment/business-health" className="hover:underline cursor-pointer">
            Assessments
=======
          <Link href="/assessment" className="hover:underline">Assessments</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/login" className="hover:underline">Login</Link>
          <Link
            href="/signup"
            className=" hover:underline"
          >
            Sign Up
>>>>>>> chaitra
          </Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center text-gray-300">
                <UserIcon className="h-5 w-5 mr-1" />
                <span>{userName}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hover:underline cursor-pointer"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:underline">Login</Link>
              <Link
                href="/signup"
                className="hover:underline"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle button */}
        <button onClick={toggleMobileMenu} className="md:hidden w-8 h-8">
          {isMobileMenuOpen ? <XMarkIcon className="text-white" /> : <Bars3Icon className="text-white" />}
        </button>
      </div>

      {/* Mobile menu */}
<<<<<<< HEAD
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 bg-slate-800 space-y-2 text-white">
          <Link href="/" className="block hover:underline" onClick={toggleMobileMenu}>Home</Link>
          <Link href="/about" className="block hover:underline" onClick={toggleMobileMenu}>About</Link>
          <Link href="/assessment/business-health" className="block hover:underline cursor-pointer" onClick={toggleMobileMenu}>
            Assessments
          </Link>
          <Link href="/contact" className="block hover:underline" onClick={toggleMobileMenu}>Contact</Link>
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4 py-2 text-gray-300">
                <UserIcon className="h-5 w-5 mr-1" />
                <span>{userName}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  toggleMobileMenu();
                }}
                className="block hover:underline cursor-pointer w-full text-left"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block hover:underline" onClick={toggleMobileMenu}>Login</Link>
              <Link href="/signup" className="block hover:underline" onClick={toggleMobileMenu}>Sign Up</Link>
            </>
          )}
=======
      {mobileMenu && (
        <div className="md:hidden px-4 pb-4 bg-slate-800  space-y-2 text-white">
          <Link href="/" className="block hover:underline" onClick={closeMenu}>Home</Link>
          <Link href="/about" className="block hover:underline" onClick={closeMenu}>About</Link>
          <Link href="/assessment" className="block hover:underline" onClick={closeMenu}>Assessments</Link>
          <Link href="/contact" className="block hover:underline" onClick={closeMenu}>Contact</Link>
          <Link href="/login" className="block hover:underline" onClick={closeMenu}>Login</Link>
          <Link href="/signup" className="block hover:underline" onClick={closeMenu}>Sign Up</Link>
>>>>>>> chaitra
        </div>
      )}
    </nav>
  );
};

export default Navbar;
