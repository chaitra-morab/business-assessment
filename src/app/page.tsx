'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import AboutSection from '@/components/AboutSection';
import {
  ShieldCheckIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleStartAssessment = () => {
    if (authService.isAuthenticated()) {
      router.push('/assessment');
    } else {
      router.push('/login?redirect=/assessment');
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="w-full pt-10 pb-4 px-4 sm:pt-12 sm:pb-6 md:pt-14 md:pb-6">
        <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-4 lg:gap-6">
          {/* Image */}
          <div className="w-full lg:w-1/2" data-aos="fade-right">
            <Image
              src="/businessgrowth.png"
              alt="Business Illustration"
              width={500}
              height={500}
              className="w-full max-w-sm mx-auto lg:mx-0"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 text-center lg:text-left" data-aos="fade-left">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-black">
              AI-Powered Business Assessment Tool
            </h1>
            <p className="text-base sm:text-lg mb-6 text-black">
              Evaluate your business health and franchise readiness with AI-driven insights and email reports.
            </p>
            <button
              onClick={handleStartAssessment}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Features Section */}
      <section className="px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto pt-6 pb-16">
        <h2 className="text-3xl font-bold text-black mb-10 text-center" data-aos="fade-up">
          Features
        </h2>
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          {/* Feature 1 */}
          <div className="flex-1 text-center" data-aos="fade-up">
            <div className="bg-slate-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Business Health Check</h3>
            <p className="text-sm text-black text-justify">
              Answer simple questions to check your business performance in areas like finance, marketing, and daily operations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex-1 text-center" data-aos="fade-up" data-aos-delay="100">
            <div className="bg-slate-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <RocketLaunchIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Franchise Readiness</h3>
            <p className="text-sm text-black text-justify">
              Know if your business is ready to expand or become a franchise by checking key factors like brand and setup.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex-1 text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-slate-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <DocumentTextIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">AI-Powered Reports</h3>
            <p className="text-sm text-black text-justify">
              After finishing the questions, get a short AI-written report with tips made just for your business — sent to your email.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex-1 text-center" data-aos="fade-up" data-aos-delay="300">
            <div className="bg-slate-700 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-2">
              <LockClosedIcon className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Safe Data Storage</h3>
            <p className="text-sm text-black text-justify">
              Your answers and details are stored safely and used only to help you get better results.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
//comment
