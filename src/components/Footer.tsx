'use client';

import Link from 'next/link';

export default function Footer() {
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
            <li><Link href="/business-health" className="hover:underline">Business Health</Link></li>
            <li><Link href="/franchise-readiness" className="hover:underline">Franchise Readiness</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3">Account</h4>
          <ul className="space-y-2">
            <li><Link href="/login" className="hover:underline">Login</Link></li>
            <li><Link href="/signup" className="hover:underline">Sign Up</Link></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm text-slate-400 mt-6">
        &copy; {new Date().getFullYear()} AI Assessment Tool. All rights reserved.
      </div>
    </footer>
  );
}
