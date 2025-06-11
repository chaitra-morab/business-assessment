'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AssessmentPage() {
  const router = useRouter();

  return (
    <div className="w-full px-4 pt-24 pb-12 flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 mb-10 text-center">
        Select Assessment
      </h1>

      {/* Assessment Cards */}
      <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {/* Business Health Card */}
        <div
          className="bg-white rounded-2xl shadow-md sm:shadow-lg p-6 sm:p-8 flex flex-col items-center 
                     transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
        >
          <Image
            src="/business_health.png"
            alt="Illustration representing Business Health"
            width={180}
            height={180}
            priority
            className="mb-4 sm:mb-6"
          />
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-slate-800 text-center">
            Business Health
          </h2>
          <button
            onClick={() => router.push('/assessment/business-health')}
            className="w-full sm:w-auto bg-yellow-400 text-black 
                     px-5 py-3 rounded-xl font-medium text-sm sm:text-base 
                     transition duration-300 transform hover:scale-105 hover:shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-yellow-300"
          >
            Start Business Health Assessment
          </button>
        </div>

        {/* Franchise Readiness Card */}
        <div
          className="bg-white rounded-2xl shadow-md sm:shadow-lg p-6 sm:p-8 flex flex-col items-center 
                     transition-transform transform hover:scale-105 hover:shadow-xl duration-300"
        >
          <Image
            src="/franchise1.png"
            alt="Illustration representing Franchise Readiness"
            width={180}
            height={175}
            priority
            className="mb-4 sm:mb-6"
          />
          <h2 className="text-lg sm:text-xl font-semibold mb-3 text-slate-800 text-center">
            Franchise Readiness
          </h2>
          <button
            onClick={() => router.push('/assessment/franchise-readiness')}
            className="w-full sm:w-auto bg-green-600 text-white 
                     px-5 py-3 rounded-xl font-medium text-sm sm:text-base transition 
                     duration-300 transform hover:scale-105 hover:shadow-md focus:outline-none 
                     focus:ring-2 focus:ring-green-400"
          >
            Franchise Readiness Check
          </button>
        </div>
      </div>
    </div>
  );
}