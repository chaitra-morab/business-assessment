'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  EnvelopeIcon,
  LockClosedIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      if (res.data.token) {
        document.cookie = `token=${res.data.token}; path=/`;
        router.push('/assessment');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setErrorMsg(err.response?.data?.message || 'Login failed. Try again.');
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
      console.error(err);
    }
  };

  return (
    <div className="relative h-auto md:h-screen text-black overflow-hidden flex flex-col md:flex-row pt-24">
      {/* Image Section */}
      <div className="relative w-full h-64 md:h-full md:w-1/2 z-0">
        <Image
          src="/picturelogin.png"
          alt="Login Illustration"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10 md:py-0 z-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-black">Welcome Back!</h2>
          <p className="text-sm text-gray-600 mb-5">Nice to see you again!</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="flex items-center gap-1 text-sm mb-1 text-black">
                <EnvelopeIcon className="w-4 h-4 text-black" />
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-black placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-pink-500 
                hover:bg-gray-200 transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-1 text-sm mb-1 text-black">
                <LockClosedIcon className="w-4 h-4 text-black" />
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-black placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-pink-500 
                hover:bg-gray-200 transition"
                required
              />
            </div>

            {/* Error Message */}
            {errorMsg && (
              <p className="text-red-600 text-sm text-center">{errorMsg}</p>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 mx-auto w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-2 
              bg-orange-500 hover:bg-orange-600 
              rounded-md text-white font-medium text-sm transition"
            >
              Login
              <ChevronDoubleRightIcon className="w-4 h-4 text-white" />
            </button>
          </form>

          {/* Footer Text */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-black underline hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
