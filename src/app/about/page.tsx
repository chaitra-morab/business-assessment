'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-20 xl:px-24">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-pink-600 mb-10 text-center">
        About the AI-Powered Business Assessment Tool
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div
          className="md:bg-white md:shadow-lg md:rounded-lg md:p-6 md:border-l-4 md:border-pink-500 transform transition-transform hover:scale-105 hover:shadow-xl"
          data-aos="fade-up"
        >
          <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-3">
            Tool Purpose
          </h2>
          <p className="text-slate-700 text-sm sm:text-base lg:text-base leading-relaxed">
            The tool helps entrepreneurs and small business owners evaluate their business health and franchising readiness using a structured, AI-powered assessment.
          </p>
        </div>

        <div
          className="md:bg-white md:shadow-lg md:rounded-lg md:p-6 md:border-l-4 md:border-pink-500 transform transition-transform hover:scale-105 hover:shadow-xl"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-lg lg:text-xl font-semibold text-slate-800 mb-3">
            How It Works
          </h2>
          <ol className="list-decimal pl-5 text-slate-700 text-sm sm:text-base lg:text-base space-y-1.5 leading-relaxed">
            <li>Select either Business Health or Franchise Readiness assessment.</li>
            <li>Answer multiple-choice questions about your business.</li>
            <li>Scores are computed using pre-defined weights.</li>
            <li>An AI engine generates a tailored report.</li>
            <li>The report is automatically sent to your email.</li>
            <li>Admins manage responses via a dashboard.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
