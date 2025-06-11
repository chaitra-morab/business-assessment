'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function FranchiseThankYou() {
  const router = useRouter();

  useEffect(() => {
    // Ensure the user is authenticated before viewing the thank you page.
    if (!authService.isAuthenticated()) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-500 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-slate-100 shadow-xl rounded-2xl p-8 text-center border border-gray-100 transform hover:scale-[1.01] transition-transform duration-300">
        <h1 className="text-3xl font-extrabold text-orange-400 mb-4 animate-bounce">
          Thank You!
        </h1>

        <p className="text-base text-black mb-4 leading-relaxed">
          Your Assessment has been successfully submitted. We appreciate your time and effort!
        </p>

        <p className="text-sm text-black mb-6 leading-relaxed">
          You can now view your personalized results and recommendations via the email we&rsquo;ve sent to guide you on your Business journey.
        </p>

        <Link
          href="/assessment"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
          Back to Assessments Home
        </Link>
      </div>
    </div>
  );
}
