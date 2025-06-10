'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentService, AssessmentQuestion, AssessmentResponse } from '@/services/assessment.service';
import { authService } from '@/services/auth.service';

interface QuestionsByDimension {
  [key: string]: AssessmentQuestion[];
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default function BusinessHealthAssessment() {
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

  const handleError = useCallback((err: ApiError) => {
    if (err?.response?.status === 401) {
      console.log('Authentication error, redirecting to login...');
      const currentPath = window.location.pathname;
      authService.logout();
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    const errorMessage = err?.response?.data?.message || err?.message || 'An unexpected error occurred. Please try again.';
    setError(errorMessage);
    setLoading(false);
  }, [router]);

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

  const initializeAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Initializing assessment...');
      const questionsData = await assessmentService.getQuestions();
      
      if (!questionsData || Object.keys(questionsData).length === 0) {
        console.error('No questions data received');
        setError('No questions available. Please try again later.');
        return;
      }

      console.log('Questions loaded:', {
        dimensions: Object.keys(questionsData),
        totalQuestions: Object.values(questionsData).reduce((acc, curr) => acc + curr.length, 0)
      });

      setQuestions(questionsData);
      const dimensionsList = Object.keys(questionsData);
      setDimensions(dimensionsList);
      if (dimensionsList.length > 0) {
        setCurrentDimension(dimensionsList[0]);
      }
      setLoading(false);
    } catch (err: unknown) {
      handleError(err as ApiError);
    }
  }, [handleError]);

  // Single useEffect for auth check and data loading
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        setLoadingMessage('Checking authentication...');
        if (!authService.isAuthenticated()) {
          console.log('User not authenticated, redirecting to login...');
          const currentPath = window.location.pathname;
          router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
          return;
        }

        setLoadingMessage('Loading assessment questions...');
        await initializeAssessment();
      } catch (err: unknown) {
        handleError(err as ApiError);
      }
    };

    checkAuthAndLoadData();
  }, [retryCount, router, handleError, initializeAssessment]);

  const handleOptionSelect = (questionId: number, optionId: number, isMultiple: boolean) => {
    setResponses(prev => {
      const existingResponse = prev.find(r => r.questionId === questionId);
      
      if (!existingResponse) {
        return [...prev, { 
          questionId, 
          selectedOptionIds: [optionId]
        }];
      }

      // Handle multi-select questions
      if (isMultiple) {
        const question = questions[currentDimension].find(q => q.id === questionId);
        const selectedOption = question?.options.find(opt => opt.id === optionId);
        const isNoneOption = selectedOption?.option_text.toLowerCase().includes('none');
        
        // If selecting "None" option
        if (isNoneOption) {
          return prev.map(r => 
            r.questionId === questionId 
              ? { ...r, selectedOptionIds: [optionId] }
              : r
          );
        }
        
        // If selecting other options
        const updatedOptionIds = existingResponse.selectedOptionIds.includes(optionId)
          ? existingResponse.selectedOptionIds.filter(id => id !== optionId)
          : [...existingResponse.selectedOptionIds, optionId];

        // Remove "None" option if it exists
        const noneOption = question?.options.find(opt => 
          opt.option_text.toLowerCase().includes('none')
        );
        const filteredIds = updatedOptionIds.filter(id => id !== noneOption?.id);

        // Special handling for questions 5, 8, and 14
        if ([5, 8, 14].includes(questionId)) {
          // For question 5, limit to 2 selections
          if (questionId === 5 && filteredIds.length > 2) {
            return prev;
          }
        }

        return prev.map(r => 
          r.questionId === questionId 
            ? { ...r, selectedOptionIds: filteredIds }
            : r
        );
      } else {
        // Single-select questions
        return prev.map(r => 
          r.questionId === questionId 
            ? { ...r, selectedOptionIds: [optionId] }
            : r
        );
      }
    });
  };

  const isOptionSelected = (questionId: number, optionId: number) => {
    return responses.some(r => 
      r.questionId === questionId && r.selectedOptionIds.includes(optionId)
    );
  };

  const handleNext = () => {
    const currentIndex = dimensions.indexOf(currentDimension);
    if (currentIndex < dimensions.length - 1) {
      setCurrentDimension(dimensions[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = dimensions.indexOf(currentDimension);
    if (currentIndex > 0) {
      setCurrentDimension(dimensions[currentIndex - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const result = await assessmentService.submitAssessment(responses);
      if (result.success) {
        router.push('/assessment/thank-you');
      } else {
        setError('Failed to submit assessment. Please try again.');
      }
    } catch (err) {
      setError('Failed to submit assessment. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const calculateProgress = () => {
    if (!dimensions.length) return 0;
    const questionsPerDimension = 3; // Each dimension has 3 questions
    const totalQuestions = dimensions.length * questionsPerDimension;
    const answeredQuestions = responses.length;
    return Math.round((answeredQuestions / totalQuestions) * 100);
  };

  // Render loading state
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

  // Render error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-gray-600 mb-4">This could be due to:</p>
          <ul className="text-left text-gray-600 mb-6">
            <li>• Network connectivity issues</li>
            <li>• Server being temporarily unavailable</li>
            <li>• Session timeout</li>
          </ul>
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
            <button
              onClick={() => {
                authService.logout();
                router.push('/login');
              }}
              className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
            >
              Logout and Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render main assessment content
  const currentQuestions = questions[currentDimension] || [];
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Business Health Assessment</h1>
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
          
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="mb-8 last:mb-0">
              <p className="text-lg font-medium text-gray-900 mb-4">
                {index + 1}. {question.question_text}
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
                      type={question.is_multiple ? 'checkbox' : 'radio'}
                      name={`question-${question.id}`}
                      checked={isOptionSelected(question.id, option.id)}
                      onChange={() => handleOptionSelect(question.id, option.id, question.is_multiple)}
                      className={`${
                        question.is_multiple ? 'rounded' : 'rounded-full'
                      } text-blue-600 focus:ring-blue-500 h-4 w-4 mr-3`}
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
              disabled={submitting || responses.length !== 15} // Total 15 questions
              className={`px-4 py-2 rounded ${
                submitting || responses.length !== 15
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
