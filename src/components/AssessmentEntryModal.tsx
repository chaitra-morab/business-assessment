import React, { useState, useEffect } from 'react';
import { BuildingOffice2Icon, UserIcon, EnvelopeIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface AssessmentEntryModalProps {
  open: boolean;
  onClose: () => void;
}

const businessTypes = [
  'Manufacturing',
  'Service',
  'Merchandising',
  'Hybrid',
  'Agriculture',
];

const AssessmentEntryModal: React.FC<AssessmentEntryModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(1); // 1: business type, 2: user form
  const [businessType, setBusinessType] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(1);
      setBusinessType('');
      setName('');
      setEmail('');
      setError('');
      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  const handleNext = () => {
    if (!businessType) {
      setError('Please select your type of business.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setError('Please enter your name and email.');
      return;
    }
    setError('');
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
        onClose();
        window.location.href = '/assessment';
      } else {
        setError(data.message || 'Something went wrong.');
        setTimeout(() => {
          onClose();
          window.location.href = '/assessment';
        }, 1000);
      }
    } catch {
      setLoading(false);
      setError('Server error.');
      setTimeout(() => {
        onClose();
        window.location.href = '/assessment';
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn border-4 border-blue-400/30">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-3xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {step === 1 && (
          <div>
            <div className="flex flex-col items-center mb-6">
              <BuildingOffice2Icon className="h-12 w-12 text-blue-500 mb-2 animate-bounce" />
              <h2 className="text-2xl font-extrabold text-blue-700 mb-2">Select your type of business</h2>
              <p className="text-gray-500 text-sm mb-2">This helps us tailor your assessment experience.</p>
            </div>
            <div className="relative mb-4">
              <select
                className="w-full p-3 pl-10 pr-8 rounded-lg border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 bg-blue-50 text-blue-900 font-semibold shadow-sm appearance-none transition-all duration-200"
                value={businessType}
                onChange={e => setBusinessType(e.target.value)}
              >
                <option value="">-- Select --</option>
                {businessTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 pointer-events-none" />
              <BuildingOffice2Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400 pointer-events-none" />
            </div>
            {error && <div className="text-red-500 text-sm mb-2 text-center font-semibold animate-pulse">{error}</div>}
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all mt-2 text-lg tracking-wide"
            >
              Next
            </button>
          </div>
        )}
        {step === 2 && (
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col items-center mb-6">
              <UserIcon className="h-12 w-12 text-purple-500 mb-2 animate-bounce" />
              <h2 className="text-2xl font-extrabold text-purple-700 mb-2">Enter your details</h2>
              <p className="text-gray-500 text-sm mb-2">We&rsquo;ll use this to personalize your results and send your report.</p>
            </div>
            <div className="mb-4 relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 pointer-events-none" />
              <input
                type="text"
                className="w-full p-3 pl-10 rounded-lg border-2 border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 bg-purple-50 text-purple-900 font-semibold shadow-sm transition-all duration-200"
                placeholder="Your Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="mb-4 relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 pointer-events-none" />
              <input
                type="email"
                className="w-full p-3 pl-10 rounded-lg border-2 border-purple-300 focus:border-purple-600 focus:ring-2 focus:ring-purple-200 bg-purple-50 text-purple-900 font-semibold shadow-sm transition-all duration-200"
                placeholder="Your Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {error && <div className="text-red-500 text-sm mb-2 text-center font-semibold animate-pulse">{error}</div>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-bold shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all mt-2 text-lg tracking-wide"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Start Assessment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AssessmentEntryModal; 