'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { assessmentService, AssessmentHistoryItem } from '@/services/assessment.service';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function Franchise_Results() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const score = searchParams.get('score');
  const status = searchParams.get('status');
  const color = searchParams.get('color');
  const numericScore = score ? parseInt(score, 10) : 0;

  // Dynamic recommendation generation
  const getRecommendation = (score: number): string => {
    if (score <= 6) {
      // Retaining double quotes, as there's only one apostrophe, but could also be template literal
      return "We recommend refining your business operations and brand. Let's connect to help you get franchise-ready.";
    } else if (score <= 11) {
      // Already correctly using template literal for "You're"
      return `You're on the right track. With some support on SOPs, legal structuring, or marketing systems, you can move to the next stage.`;
    } else {
      // FIX: Replaced smart quote (’) with straight apostrophe (') inside the template literal.
      return `Great! You're franchise-ready. Let's help you design your franchise strategy, legal documents, and expansion plan.`;
    }
  };

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    loadHistory();
  }, [router]); // 'router' is correctly included as a dependency.

  const loadHistory = async () => {
    try {
      const historyData = await assessmentService.getHistory();
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load assessment history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-6 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      {/* Increased max-w for a wider, yet still compact, hero section */}
      <div className="max-w-2xl mx-auto">
        {/* Current Assessment Result card - further reduced padding and margins for decreased height */}
        <div className="bg-white shadow-lg rounded-2xl p-5 mb-5 text-center">
          {/* Smaller heading */}
          <h1 className="text-2xl font-extrabold text-blue-900 mb-2">
            Franchise Readiness Results
          </h1>
          {/* Smaller font */}
          <p className="text-sm text-blue-600 mb-4">
            Your assessment is complete! Here's your readiness level.
          </p>

          <div className="flex flex-col items-center justify-center mb-4">
            {/* Circular Progress for Score - slightly smaller to reduce height */}
            <div className="relative w-28 h-28 mb-3">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E0E7FF"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={color || '#666'}
                  strokeWidth="3"
                  strokeDasharray={`${(numericScore / 16) * 100}, 100`}
                  strokeLinecap="round"
                />
                {/* Smaller font for score */}

                <text x="18" y="22" fontSize="6" fontWeight="bold" textAnchor="middle" fill={color || '#666'}>
                  {numericScore} / 16
                </text>

              </svg>
            </div>

            {/* Smaller font */}
            <p className="text-lg font-bold mb-1" style={{ color: color || 'black' }}>
              Readiness Level: {status}
            </p>
          </div>

          {/* Dynamic Recommendation - reduced padding and font sizes */}
          <div className="bg-blue-50 p-4 rounded-xl text-left border border-blue-100">
            {/* Smaller heading */}
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Our Recommendation</h3>
            {/* Smaller font */}
            <p className="text-sm text-blue-800 leading-relaxed">
              {getRecommendation(numericScore)}
            </p>
          </div>
        </div>

        {/* Home Page Link - reduced padding, font size, and margin-top */}
        <div className="text-center mt-5 mb-5">
          <Link href="/assessment" className="inline-flex items-center px-5 py-2.5 border border-transparent
            text-sm font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300">
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Go to Assessments Home
          </Link>
        </div>

        {/* Assessment History - integrated within the main container and made more compact */}
        {history.length > 0 && (
          <div className="bg-white shadow-lg rounded-2xl p-5"> {/* Reduced padding */}
            {/* Smaller heading */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Assessment History</h2>
            <div className="space-y-2"> {/* Reduced spacing */}
              {history.map((item, index) => (
                <div
                  key={index}
                  className="border-b last:border-b-0 pb-2 last:pb-0" // Reduced padding-bottom
                >
                  <div className="flex justify-between items-center">
                    <div>
                      {/* Smaller font */}
                      <p className="text-sm font-medium">
                        Score: <span style={{ color: item.color }}>{item.score}</span>
                      </p>
                      {/* Smaller font */}
                      <p className="text-xs text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {/* Smaller font */}
                      <p className="text-sm" style={{ color: item.color }}>
                        {item.status}
                      </p>
                      {/* Smaller font */}
                      <p className="text-xs text-gray-600">
                        {item.dimensions?.join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}