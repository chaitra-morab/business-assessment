'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentService, AssessmentQuestion, AssessmentResponse } from '@/services/assessment.service';

interface QuestionsByDimension {
  [key: string]: AssessmentQuestion[];
}

export default function FranchiseReadiness() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionsByDimension>({});
  const [currentDimension, setCurrentDimension] = useState<string>('');
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  // Error handler
  const handleError = useCallback((err: unknown) => {
    if (err && typeof err === 'object' && 'message' in err && typeof (err as unknown as { message?: unknown }).message === 'string') {
      setError((err as { message: string }).message);
    } else {
      setError('An unexpected error occurred. Please try again.');
    }
    setLoading(false);
  }, []);

  // Retry handler
  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setError('');
      setLoading(true);
      setLoadingMessage('Retrying to load questions...');
      setRetryCount(prev => prev + 1);
    } else {
      setError('Unable to load questions after multiple attempts. Please contact support.');
    }
  };

  // Initialization
  const initializeAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      setLoadingMessage('Initializing...');
      setLoadingMessage('Loading assessment questions...');
      const questionsData = await assessmentService.getQuestions(2);
      if (!questionsData || Object.keys(questionsData).length === 0) {
        setError('No questions available. Please try again later.');
        return;
      }
      setQuestions(questionsData);
      const dims = Object.keys(questionsData);
      setDimensions(dims);
      if (dims.length > 0) setCurrentDimension(dims[0]);
      setLoading(false);
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  useEffect(() => {
    initializeAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  // Handle radio select (single-select only)
  const handleOptionSelect = (questionId: number, optionId: number) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (!existing) {
        return [...prev, { questionId, selectedOptionIds: [optionId] }];
      }
      return prev.map(r =>
        r.questionId === questionId
          ? { ...r, selectedOptionIds: [optionId] }
          : r
      );
    });
  };

  const isOptionSelected = (questionId: number, optionId: number) =>
    responses.some(r => r.questionId === questionId && r.selectedOptionIds[0] === optionId);

  const handleNext = () => {
    const idx = dimensions.indexOf(currentDimension);
    if (idx < dimensions.length - 1) setCurrentDimension(dimensions[idx + 1]);
  };

  const handlePrevious = () => {
    const idx = dimensions.indexOf(currentDimension);
    if (idx > 0) setCurrentDimension(dimensions[idx - 1]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not found. Please start the assessment from the homepage.');
        setSubmitting(false);
        return;
      }
      const result = await assessmentService.submitAssessment(responses, 2, userId);
      if (result.success) {
        router.push(`/assessment/thank_you?score=${result.score}&status=${encodeURIComponent(result.status)}`);
      } else {
        setError('Failed to submit assessment. Please try again.');
      }
    } catch {
      setError('Failed to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Progress calculation
  const totalQuestions = Object.values(questions).reduce((acc, arr) => acc + arr.length, 0);
  const progress = totalQuestions ? Math.round((responses.length / totalQuestions) * 100) : 0;
  const currentQuestions = questions[currentDimension] || [];

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">{loadingMessage}</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              disabled={retryCount >= MAX_RETRIES}
              className={`px-4 py-2 rounded ${
                retryCount >= MAX_RETRIES
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              Retry Loading Questions
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Franchise Readiness Assessment</h1>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentDimension}</h2>
          {currentQuestions.map((question, idx) => (
            <div key={question.id} className="mb-8 last:mb-0">
              <p className="text-lg font-medium text-gray-900 mb-4">
                {idx + 1}. {question.question_text}
              </p>
              <div className="space-y-3">
                {question.options.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      isOptionSelected(question.id, option.id)
                        ? 'bg-blue-50 border-blue-500'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={!!isOptionSelected(question.id, option.id)}
                      onChange={() => handleOptionSelect(question.id, option.id)}
                      className="rounded-full text-blue-600 focus:ring-blue-500 h-4 w-4 mr-3"
                    />
                    <span className="text-gray-900">{option.option_text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={dimensions.indexOf(currentDimension) === 0}
            className={`px-4 py-2 rounded ${
              dimensions.indexOf(currentDimension) === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            Previous
          </button>
          {dimensions.indexOf(currentDimension) === dimensions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={submitting || responses.length !== totalQuestions}
              className={`px-4 py-2 rounded ${
                submitting || responses.length !== totalQuestions
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!currentQuestions.every(q => responses.some(r => r.questionId === q.id))}
              className={`px-4 py-2 rounded ${
                !currentQuestions.every(q => responses.some(r => r.questionId === q.id))
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 