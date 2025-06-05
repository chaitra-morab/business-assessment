'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';

const ContactSection = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-white overflow-hidden px-6 md:px-16 py-12">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-50 pointer-events-none z-0" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 py-16">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Let us know how we can help you
        </p>
      </div>

      {/* Contact Info Row */}
      <div className="relative z-10 max-w-6xl mx-auto flex flex-wrap justify-center gap-6">
        {/* Card: Email */}
        <div className="bg-slate-100 flex flex-col items-start gap-2 rounded-lg shadow p-6 w-full sm:w-[300px]">
          <div className="flex items-center gap-2 mb-1 font-semibold text-lg">
            <EnvelopeIcon className="h-6 w-6 text-slate-700" />
          </div>
          <p className="text-black font-semibold">CHAT TO US</p>
          <p className="text-gray-700">We are here to help.</p>
          <a
            href="mailto:hello@anklyticx.com"
            className="text-black hover:underline font-medium"
          >
            hello@anklyticx.com
          </a>
        </div>

        {/* Card: Location */}
        <div className="bg-slate-100 flex flex-col items-start gap-2 rounded-lg shadow p-6 w-full sm:w-[300px]">
          <div className="flex items-center gap-2 mb-1 font-semibold text-lg">
            <MapPinIcon className="h-6 w-6 text-slate-700" />
            
          </div>
          <p className="text-black font-semibold">OFFICE</p>
          <p className="text-gray-700">Visit our office HQ.</p>
          <p className="text-black font-medium">Goa, India</p>
        </div>

        {/* Card: Phone */}
        <div className="bg-slate-100 flex flex-col items-start gap-2 rounded-lg shadow p-6 w-full sm:w-[300px]">
          <div className="flex items-center gap-2 mb-1 font-semibold text-lg">
            <PhoneIcon className="h-6 w-6 text-slate-700" />
          </div>
          <p className="text-black font-semibold">PHONE</p>
          <p className="text-gray-700">Mon–Fri from 10am to 6pm</p>
          <p className="text-black font-medium">+91 0000000000</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
