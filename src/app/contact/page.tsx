'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {EnvelopeIcon,MapPinIcon,PhoneIcon,FaceSmileIcon,ChatBubbleBottomCenterTextIcon,LinkIcon,} from '@heroicons/react/24/solid';

const ContactSection = () => {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 md:px-16 py-12 bg-gray-50">
      {/* Text Content */}
      <div className="md:w-1/2 space-y-6" data-aos="fade-right">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Get in Touch</h2>


        {/* Email */}
        <div>
          <div className="flex items-center gap-2 mb-1 font-semibold text-lg">
            <EnvelopeIcon className="h-6 w-6 text-blue-600" />
            <span>CHART TO US</span>
          </div>
          <p className="text-blue-600 underline">Our friendly team is here to help.</p>
          <a href="Anklyticx" className="text-yellow-600 font-medium hover:underline">Anklyticx</a>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 mb-1 font-semibold text-lg">
            <MapPinIcon className="h-6 w-6 text-blue-600" />
            <span>OFFICE</span>
          </div>
          <p className="text-blue-600 underline">Come say hello at our office HQ.</p>
          <p className="text-yellow-600 font-medium">Goa,India</p>
        </div>

        {/* Phone */}
        <div>
          <div className="flex items-center gap-2 mb-1 font-semibold text-lg">
            <PhoneIcon className="h-6 w-6 text-blue-600" />
            <span>PHONE</span>
          </div>
          <p className="text-blue-600">Mon–Fri from 10am to 6pm</p>
          <p className="text-yellow-600 font-medium">+91 0000000000</p>
        </div>

      </div>

      {/* Image */}
      <div className="md:w-1/2" data-aos="fade-left">
        <img
          src="/contact_us.png"
          alt="Contact Illustration"
          className="w-full max-w-md mx-auto"
        />
      </div>
    </section>
  );
};

export default ContactSection;
