'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleStartAssessment = () => {
    const tokenExists = document.cookie.includes('token=');
    if (tokenExists) {
      router.push('/assessment');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-5xl mx-auto flex flex-col-reverse lg:flex-row items-center lg:items-start gap-12">
          {/* Image/Illustration */}
          <div className="w-full lg:w-1/2 relative" data-aos="fade-right">
            <Image
              src="/businessgrowth.png"
              alt="Business Illustration"
              width={500}
              height={500}
              className="w-full max-w-md mx-auto lg:mx-0"
            />
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left" data-aos="fade-left">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              AI-Powered Business Assessment Tool
            </h1>
            <p className="text-lg sm:text-xl mb-8">
              Evaluate your business health and franchise readiness with AI-driven insights and email reports.
            </p>
            <button
              onClick={handleStartAssessment}
              className="bg-gradient-to-r from-slate-700 via-pink-600 to-pink-500 text-white px-6 py-3 rounded font-semibold hover:brightness-110 transition-transform transform hover:scale-105"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-24 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-pink-600 mb-10" data-aos="fade-up">
          Features
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div
            className="bg-white shadow-md rounded-lg p-6 border-l-4 border-pink-500 transform transition-transform hover:scale-105 hover:shadow-lg"
            data-aos="fade-up"
          >
            <h3 className="text-xl font-semibold mb-2">AI-Generated Reports</h3>
            <p>Receive personalized, data-driven insights based on your answers.</p>
          </div>
          <div
            className="bg-white shadow-md rounded-lg p-6 border-l-4 border-pink-500 transform transition-transform hover:scale-105 hover:shadow-lg"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3 className="text-xl font-semibold mb-2">Email Delivery</h3>
            <p>Your tailored business report is sent directly to your inbox.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
