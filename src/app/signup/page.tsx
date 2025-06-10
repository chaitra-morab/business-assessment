'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRightEndOnRectangleIcon,
  ChevronDoubleRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import axios from 'axios';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      });

      if (res.status === 201 || res.data.success) {
        router.push('/login');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setErrorMsg('Network error. Please check if the server is running.');
        } else {
          setErrorMsg(err.response?.data?.message || 'Signup failed. Try again.');
        }
      } else {
        setErrorMsg('An unexpected error occurred.');
      }
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-auto md:h-screen text-black overflow-hidden flex flex-col md:flex-row pt-24">
      {/* Image Section */}
      <div className="relative w-full h-64 md:h-full md:w-1/2 z-0">
        <Image
          src="/login.png"
          alt="Signup Illustration"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Form Section */}
      <div className="relative w-full md:w-1/2 flex items-center justify-center px-4 sm:px-6 py-10 md:py-0 z-10 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-black flex items-center gap-2">
            Sign Up
            <ArrowRightEndOnRectangleIcon className="w-5 h-5 text-black" />
          </h2>

          <p className="text-sm text-gray-600 mb-5">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-1 text-sm mb-1 text-black">
                <UserIcon className="w-4 h-4 text-black" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-black placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-pink-500 
                hover:bg-gray-200 transition"
                required
              />
            </div>

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

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 w-full py-2 
              bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 
              rounded-md text-white font-medium text-sm transition
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Signing up...' : 'Signup'}
              {!isLoading && <ChevronDoubleRightIcon className="w-4 h-4 text-white" />}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-pink-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
