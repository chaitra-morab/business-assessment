'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
// import { authService } from '@/services/auth.service'; // Removed unused import
import AboutSection from '@/components/AboutSection';
import {
  ShieldCheckIcon,
  RocketLaunchIcon,
  DocumentTextIcon,
  LockClosedIcon,
} from '@heroicons/react/24/solid';
import { useAssessmentModal } from '@/components/ModalProvider';

export default function Home() {
  const router = useRouter();
  const { openModal } = useAssessmentModal();
  const [step, setStep] = useState(0); // 0: initial, 1: business type, 2: user form
  const [businessType, setBusinessType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleNext = () => {
    if (!businessType) {
      return;
    }
    setStep(2);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/users/check-or-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      setLoading(false);
      const data = await res.json();
      if (res.ok) {
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        router.push('/assessment');
      } else {
        setTimeout(() => router.push('/assessment'), 1000);
      }
    } catch {
      setLoading(false);
      setTimeout(() => router.push('/assessment'), 1000);
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
              onClick={openModal}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Start Assessment
            </button>
            {step === 1 && (
              <div className="mt-4 bg-white p-4 rounded shadow-md">
                <label className="block mb-2 font-semibold text-black">Select your type of business</label>
                <select
                  className="w-full p-2 border rounded mb-2"
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value)}
                >
                  <option value="">-- Select --</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Service">Service</option>
                  <option value="Merchandising">Merchandising</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Agriculture">Agriculture</option>
                </select>
                <button
                  onClick={handleNext}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Next
                </button>
              </div>
            )}
            {step === 2 && (
              <form onSubmit={handleFormSubmit} className="mt-4 bg-white p-4 rounded shadow-md">
                <div className="mb-2">
                  <label className="block mb-1 font-semibold text-black">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-semibold text-black">Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Start Assessment'}
                </button>
              </form>
            )}
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
