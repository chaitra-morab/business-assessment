"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, X } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-blue-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center animate-fade-in-up relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
          onClick={() => router.push('/')}
        >
          <X size={24} />
        </button>
        <div className="bg-blue-100 rounded-full p-4 mb-4 shadow-md">
          <Lock size={40} className="text-blue-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-blue-700 mb-2 tracking-tight flex items-center gap-2">
          <User size={28} className="text-blue-500" /> Admin Login
        </h2>
        <p className="text-gray-500 mb-6 text-center">Sign in to your admin dashboard</p>
        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {error && <div className="text-red-500 text-center font-semibold">{error}</div>}
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-all duration-200 pl-12"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <User size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-500 outline-none transition-all duration-200 pl-12"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-blue-700 transition-all duration-200 mt-2 flex items-center justify-center gap-2">
            <Lock size={20} className="inline-block" /> Login
          </button>
        </form>
      </div>
    </div>
  );
} 