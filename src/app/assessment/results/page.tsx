'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentService, AssessmentHistoryItem } from '@/services/assessment.service';
import { authService } from '@/services/auth.service';

export default function AssessmentResults() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState<AssessmentHistoryItem[]>([]);

  useEffect(() => {
    const loadResults = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const data = await assessmentService.getHistory();
        setResults(data);
        setLoading(false);
      } catch {
        setErrorMessage('Failed to load assessment results. Please try again later.');
        setLoading(false);
      }
    };

    loadResults();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{errorMessage}</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Current Assessment Result */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Assessment Results
          </h1>

          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-lg text-gray-600 mb-2">Your Business Health Score</p>
              <div className="text-5xl font-bold" style={{ color: results[0].color }}>
                {results[0].score}
              </div>
              <p className="text-xl mt-2" style={{ color: results[0].color }}>
                {results[0].status}
              </p>
            </div>

            {/* Circular Progress */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#eee"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={results[0].color || '#666'}
                  strokeWidth="3"
                  strokeDasharray={`${Number(results[0].score)}, 100`}
                />
                <text x="18" y="20.35" className="text-3xl" textAnchor="middle" fill={results[0].color || '#666'}>
                  {results[0].score}%
                </text>
              </svg>
            </div>
          </div>

          {/* Recommendations based on score */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="list-disc list-inside space-y-2">
              {Number(results[0].score) <= 49 && (
                <>
                  <li>Consider immediate strategic planning to address critical areas</li>
                  <li>Book a consultation with our experts for detailed improvement plan</li>
                  <li>Focus on quick wins in operational efficiency</li>
                </>
              )}
              {Number(results[0].score) > 49 && Number(results[0].score) <= 74 && (
                <>
                  <li>Identify specific areas for improvement in each dimension</li>
                  <li>Develop action plans for medium-term growth</li>
                  <li>Consider optimization opportunities in key processes</li>
                </>
              )}
              {Number(results[0].score) > 74 && (
                <>
                  <li>Focus on maintaining current performance levels</li>
                  <li>Explore opportunities for innovation and expansion</li>
                  <li>Consider sharing best practices within your industry</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Assessment History */}
        {results.length > 1 && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assessment History</h2>
            <div className="space-y-4">
              {results.map((item, index) => (
                <div 
                  key={index}
                  className="border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-medium">
                        Score: <span style={{ color: item.color }}>{item.score}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg" style={{ color: item.color }}>
                        {item.status}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.dimensions.join(', ')}
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