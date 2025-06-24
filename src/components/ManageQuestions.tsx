 'use client';

import React, { useEffect, useState } from "react";

function getTokenFromCookie() {
  if (typeof document === 'undefined') return '';
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : '';
}

interface Question {
  id: number;
  question_text: string;
  weight: number;
  dimension_name: string;
  questionnaire_name: string;
}

const PAGE_TITLES = [
  'Business Health Questions',
  'Franchise Readiness Questions',
];

const QUESTIONNAIRE_NAMES = [
  'Business Health Assessment',
  'Franchise Readiness Checker',
];

const ManageQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0); // 0: Business Health, 1: Franchise Readiness

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const token = getTokenFromCookie();
        const res = await fetch("/api/questions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch {
        setQuestions([]);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  // Filter questions for each page by questionnaire name
  const filteredQuestions = questions.filter((q) => {
    return (
      q.questionnaire_name === QUESTIONNAIRE_NAMES[page]
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Manage Questions</h1>
      <h2 className="text-2xl font-semibold mb-4">{PAGE_TITLES[page]}</h2>
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {loading ? (
          <div className="text-gray-500 text-center py-8">Loading...</div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No questions added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead className="sticky top-0 z-10 bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100 rounded-tl-xl">Question ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider bg-gray-100 rounded-tr-xl">Weight</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuestions.map((q) => (
                  <tr key={q.id} className="bg-gray-50 hover:bg-blue-50 transition rounded-xl shadow-sm">
                    <td className="px-6 py-3 font-mono text-sm text-gray-700 rounded-l-xl">{q.id}</td>
                    <td className="px-6 py-3 text-gray-900">{q.question_text}</td>
                    <td className="px-6 py-3 text-center text-blue-700 font-bold rounded-r-xl">{q.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
            onClick={() => setPage(0)}
            disabled={page === 0}
          >
            Previous
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageQuestions; 