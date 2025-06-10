'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentService, AssessmentQuestion, AssessmentResponse } from '@/services/assessment.service';
import { authService } from '@/services/auth.service';

interface QuestionsByDimension {
  [key: string]: AssessmentQuestion[];
}

// Define a more specific type for the error object if it comes from an API response
interface ApiResponseError {
  response?: {
    status?: number;
    data?: {
      message?: string;
    };
  };
}

export default function FranchiseReadinessAssessment() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionsByDimension>({});
  const [currentDimension, setCurrentDimension] = useState<string>('');
  const [dimensions, setDimensions] = useState<string[]>([]);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Ref for scrolling to top of the assessment container
  const assessmentContainerRef = useRef<HTMLDivElement>(null);

  // Memoize initializeAssessment using useCallback
  const initializeAssessment = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching questions for Franchise Readiness Assessment...');
      // Fetching the specific franchise readiness questions
      const questionsData = await assessmentService.getQuestions('franchise-readiness');
      console.log('Questions received:', questionsData);

      if (!questionsData || Object.keys(questionsData).length === 0) {
        setError('No questions available. Please try again later.');
        return;
      }

      setQuestions(questionsData);
      const dimensionsList = Object.keys(questionsData);
      setDimensions(dimensionsList);
      if (dimensionsList.length > 0) {
        setCurrentDimension(dimensionsList[0]);
      }
    } catch (err: unknown) { // Use unknown for better type safety
      console.error('Error loading questions:', err);

      // Type guard for checking if the error has a response property
      const isApiResponseError = (e: unknown): e is ApiResponseError => {
        return typeof e === 'object' && e !== null && 'response' in e;
      };

      if (isApiResponseError(err) && err.response?.status === 401) {
        const currentPath = window.location.pathname;
        authService.logout();
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }
      // Accessing message safely using optional chaining and nullish coalescing
      setError((err as ApiResponseError)?.response?.data?.message || 'Failed to load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [router]); // `router` is a dependency for useCallback

  useEffect(() => {
    // Check authentication first
    if (!authService.isAuthenticated()) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    initializeAssessment();
  }, [initializeAssessment, router]); // initializeAssessment is now stable

  // Scroll to top when dimension changes
  useEffect(() => {
    if (assessmentContainerRef.current) {
      assessmentContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentDimension]);

  const handleOptionSelect = (questionId: number, optionId: number, isMultiple: boolean) => {
    setResponses(prev => {
      const existingResponse = prev.find(r => r.questionId === questionId);

      if (!existingResponse) {
        return [...prev, {
          questionId,
          selectedOptionIds: [optionId]
        }];
      }

      // Handle multi-select questions (if any, though the current framework implies single-select)
      if (isMultiple) {
        const question = questions[currentDimension]?.find(q => q.id === questionId);
        const selectedOption = question?.options.find(opt => opt.id === optionId);
        const isNoneOption = selectedOption?.option_text.toLowerCase().includes('none');

        let updatedOptionIds: number[];

        if (isNoneOption) {
          updatedOptionIds = [optionId];
        } else {
          const noneOption = question?.options.find(opt =>
            opt.option_text.toLowerCase().includes('none')
          );

          if (existingResponse.selectedOptionIds.includes(optionId)) {
            updatedOptionIds = existingResponse.selectedOptionIds.filter(id => id !== optionId);
          } else {
            updatedOptionIds = [...existingResponse.selectedOptionIds, optionId].filter(id =>
              id !== noneOption?.id
            );
          }
        }

        return prev.map(r =>
          r.questionId === questionId
            ? { ...r, selectedOptionIds: updatedOptionIds }
            : r
        );
      } else {
        // Single-select questions (as per the Franchise Readiness Checker framework)
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
      // `totalScore` and derived readiness levels are no longer used here as per the previous resolution
      // If needed for the thank you page, you'd pass them via query params or context.
      // let totalScore = 0;
      // Object.values(questions).flat().forEach(q => {
      //   const response = responses.find(r => r.questionId === q.id);
      //   if (response && response.selectedOptionIds.length > 0) {
      //     const selectedOption = q.options.find(opt => opt.id === response.selectedOptionIds[0]);
      //     if (selectedOption) {
      //       const optionTextLower = selectedOption.option_text.toLowerCase();
      //       if (optionTextLower.includes('yes')) {
      //         totalScore += 2;
      //       } else if (optionTextLower.includes('somewhat') || optionTextLower.includes('in progress')) {
      //         totalScore += 1;
      //       } else if (optionTextLower.includes('no') || optionTextLower.includes('not yet')) {
      //         totalScore += 0;
      //       }
      //     }
      //   }
      // });

      // You might still submit the assessment to the service if needed for history
      const result = await assessmentService.submitAssessment(responses, 'franchise-readiness');

      if (result.success) {
        // Updated path to the Franchise_Thankyou page
        router.push(`/assessment/Franchise_Thankyou`); // Removed query parameters as Franchise_Thankyou page doesn't consume them.
      } else {
        setError('Failed to submit assessment. Please try again.');
      }
    } catch (err: unknown) { // Use unknown for better type safety
      setError('Failed to submit assessment. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Show error state with retry button
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={initializeAssessment}
          className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const currentQuestions = questions[currentDimension] || [];
  const isFirstDimension = dimensions.indexOf(currentDimension) === 0;
  const isLastDimension = dimensions.indexOf(currentDimension) === dimensions.length - 1;

  // Check if all questions in the current dimension have at least one response
  const isCurrentDimensionComplete = currentQuestions.every(q =>
    responses.some(r => r.questionId === q.id && r.selectedOptionIds.length > 0)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8" ref={assessmentContainerRef}>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">
              Franchise Readiness Assessment
            </h1>
            <p className="text-blue-600 text-lg">
              Evaluate your business&apos;s readiness for franchising
            </p>
          </div>

          ---

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-blue-700 mb-2">
              <span className="font-medium">Assessment Progress</span>
              <span className="font-semibold">{Math.round((responses.length / Object.values(questions).flat().length) * 100)}%</span>
            </div>
            <div className="h-3 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(responses.length / Object.values(questions).flat().length) * 100}%` }}
              ></div>
            </div>
          </div>

          ---

          {/* Current Dimension Title */}
          <div className="mb-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-900">
              {currentDimension}
            </h2>
            <p className="text-blue-600 mt-1">
              {currentDimension === 'Business Model Readiness'
                ? 'Evaluate your core business fundamentals'
                : 'Assess your franchise infrastructure and support systems'}
            </p>
          </div>

          ---

          {/* Questions */}
          <div className="space-y-6">
            {currentQuestions.map((question, index) => (
              <div
                key={question.id}
                className="bg-white rounded-xl border border-blue-100 p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-blue-900 font-medium mb-4">
                      {question.question_text}
                      {question.is_multiple && (
                        <span className="text-sm text-blue-600 ml-2 font-normal">(Select all that apply)</span>
                      )}
                    </p>
                    <div className="space-y-3">
                      {question.options.map(option => (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(question.id, option.id, question.is_multiple)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center group
                            ${isOptionSelected(question.id, option.id)
                              ? 'bg-blue-50 border-blue-200 text-blue-700'
                              : 'bg-white hover:bg-blue-50 border-blue-100'
                            } border`}
                        >
                          <div className={`mr-4 w-5 h-5 border-2 rounded${question.is_multiple ? '' : '-full'}
                            flex items-center justify-center transition-all duration-200
                            ${isOptionSelected(question.id, option.id)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-blue-300 group-hover:border-blue-400'
                            }`}
                          >
                            {isOptionSelected(question.id, option.id) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                              </svg>
                            )}
                          </div>
                          <span className={`text-base ${isOptionSelected(question.id, option.id) ? 'font-medium' : ''}`}>
                            {option.option_text}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          ---

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-blue-100">
            <button
              onClick={handlePrevious}
              disabled={isFirstDimension}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                ${isFirstDimension
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
              <span>Previous</span>
            </button>

            {isLastDimension ? (
              <button
                onClick={handleSubmit}
                disabled={!isCurrentDimensionComplete || submitting}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                  ${!isCurrentDimensionComplete || submitting
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                  }`}
              >
                <span>{submitting ? 'Submitting...' : 'Submit Assessment'}</span>
                {!submitting && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isCurrentDimensionComplete}
                className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
                  ${!isCurrentDimensionComplete
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  }`}
              >
                <span>Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}