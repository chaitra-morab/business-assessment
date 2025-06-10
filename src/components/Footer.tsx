'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function Footer() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsAuthenticated(authService.isAuthenticated());
  }, []);

  // Don't render authentication-dependent content until after mounting
  if (!mounted) {
    return null;
  }

  const handleAssessmentClick = (type: 'health' | 'franchise') => (e: React.MouseEvent) => {
    e.preventDefault();
    if (authService.isAuthenticated()) {
      router.push(type === 'health' ? '/assessment/business-health' : '/assessment/franchise-readiness');
    } else {
      router.push('/login');
    }
  };

  return (
    <footer className="w-full bg-slate-800 text-white py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <h4 className="text-lg font-semibold mb-3">AI Assessment Tool</h4>
          <p className="text-slate-300">
            Empowering entrepreneurs with data-driven insights to grow and franchise.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Navigation</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li><Link href="/about" className="hover:underline">About</Link></li>
            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Assessments</h4>
          <ul className="space-y-2">
            <li>
              <a 
                href="#" 
                onClick={handleAssessmentClick('health')}
                className="hover:underline cursor-pointer"
              >
                Business Health
              </a>
            </li>
            <li>
              <a 
                href="#" 
                onClick={handleAssessmentClick('franchise')}
                className="hover:underline cursor-pointer"
              >
                Franchise Readiness
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Account</h4>
          <ul className="space-y-2">
            {!isAuthenticated ? (
              <>
                <li><Link href="/login" className="hover:underline">Login</Link></li>
                <li><Link href="/signup" className="hover:underline">Sign Up</Link></li>
              </>
            ) : (
              <li>
                <button 
                  onClick={() => {
                    authService.logout();
                    setIsAuthenticated(false);
                    router.push('/');
                  }}
                  className="hover:underline cursor-pointer"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-slate-400 mt-6">
        &copy; {new Date().getFullYear()} AI Assessment Tool. All rights reserved.
      </div>
    </footer>
  );
}
