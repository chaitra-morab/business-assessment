'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/auth.service';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
<<<<<<< HEAD
      await authService.login(email, password);
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message ||
        apiError.message ||
        'An error occurred during login'
      );
    } finally {
      setLoading(false);
=======
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
>>>>>>> chaitra
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
=======
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
>>>>>>> chaitra
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
<<<<<<< HEAD
=======
                className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-black placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-pink-500 
                hover:bg-gray-200 transition"
                required
>>>>>>> chaitra
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
<<<<<<< HEAD
=======
                className="w-full px-4 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md text-black placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-pink-500 
                hover:bg-gray-200 transition"
                required
>>>>>>> chaitra
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Login failed
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
<<<<<<< HEAD
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                loading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
=======
              className="flex items-center justify-center gap-2 mx-auto w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 py-2 
              bg-orange-500 hover:bg-orange-600 
              rounded-md text-white font-medium text-sm transition"
>>>>>>> chaitra
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
<<<<<<< HEAD
          </div>
        </form>
=======
          </form>

          {/* Footer Text */}
          <p className="mt-6 text-sm text-center text-gray-600">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-black underline hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
>>>>>>> chaitra
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
