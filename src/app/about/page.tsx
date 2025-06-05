'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import {
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  CalculatorIcon,
  SparklesIcon,
  EnvelopeOpenIcon,
} from '@heroicons/react/24/outline';

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true, });
  }, []);

  return (
    <div className="w-full pt-[96px] pb-16 px-4 sm:px-6 lg:px-20 xl:px-24 bg-slate-100">


      {/* Tool Purpose */}
      <div className="text-center max-w-3xl mx-auto mb-16" data-aos="fade-up">
        <h2 className="text-2xl font-bold text-black mb-4">Tool Purpose</h2>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          The tool helps entrepreneurs and small business owners evaluate their business health and franchising readiness using a structured, AI-powered assessment.
        </p>
      </div>

      {/* How It Works */}
      <h2 className="text-2xl font-bold text-black text-center mb-10" data-aos="fade-up">
        How It Works
      </h2>

      <div className="flex flex-wrap justify-center gap-6 max-w-screen-xl mx-auto">
        {/* Card 1 */}
        <div className="flex-1 min-w-[250px] max-w-xs bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="0">
          <ClipboardDocumentListIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">Choose Assessment</h3>
          <p className="text-sm text-slate-600">Select Business Health or Franchise Readiness assessment.</p>
        </div>

        {/* Card 2 */}
        <div className="flex-1 min-w-[250px] max-w-xs bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="100">
          <QuestionMarkCircleIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">Answer Questions</h3>
          <p className="text-sm text-slate-600">Respond to structured, multiple-choice questions.</p>
        </div>

        {/* Card 3 */}
        <div className="flex-1 min-w-[250px] max-w-xs bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="200">
          <CalculatorIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">Scoring Engine</h3>
          <p className="text-sm text-slate-600">Scores are computed using predefined logic and weights.</p>
        </div>

        {/* Card 4 */}
        <div className="flex-1 min-w-[250px] max-w-xs bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="300">
          <SparklesIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">AI-Generated Report</h3>
          <p className="text-sm text-slate-600">An AI engine prepares a personalized business report.</p>
        </div>

        {/* Card 5 */}
        <div className="flex-1 min-w-[250px] max-w-xs bg-white p-6 rounded-xl shadow-md text-center" data-aos="fade-up" data-aos-delay="400">
          <EnvelopeOpenIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">Email Delivery</h3>
          <p className="text-sm text-slate-600">The detailed report is sent directly to your inbox.</p>
        </div>
      </div>
    </div>
  );
}
