'use client';

import { useState } from 'react';

interface Option {
  text: string;
  points: number;
}

interface Question {
  question: string;
  description: string;
  options: Option[];
}

interface AnswerEntry {
  text: string;
  points: number;
}

const quizData: Question[] = [
  {
    question: "1. Is your business consistently profitable?",
    description: "Franchisors must show a history of financial viability.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "2. Do you have a unique, proven business model?",
    description: "It should be differentiated and replicable.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "3. Are your operations well-documented and standardized?",
    description: "Franchisees need detailed SOPs to run the business.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "4. Can your business function without you being present daily?",
    description: "You must be able to transfer operational control.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "5. Do you have a recognizable brand with clear positioning?",
    description: "Brand value makes franchising attractive.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "6. Have you identified your ideal franchisee profile?",
    description: "Knowing who to recruit is key to growth.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "7. Do you have a marketing and support system in place for new locations?",
    description: "Franchisees will need assistance to start and grow.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  },
  {
    question: "8. Have you considered legal and compliance aspects of franchising in your region?",
    description: "Franchising requires a franchise agreement and disclosure document.",
    options: [
      { text: "Yes", points: 2 },
      { text: "Somewhat / In Progress", points: 1 },
      { text: "No / Not Yet", points: 0 }
    ]
  }
];

const scoringLogic = {
  notReady: {
    range: [0, 6],
    level: "Not Ready",
    interpretation: "You’re in early stages. Focus on strengthening your business foundation.",
    nextSteps: "We recommend refining your business operations and brand. Let's connect to help you get franchise-ready."
  },
  somewhatReady: {
    range: [7, 11],
    level: "Somewhat Ready",
    interpretation: "Promising signs. Address key gaps before franchising.",
    nextSteps: "You're on the right track. With some support on SOPs, legal structuring, or marketing systems, you can move to the next stage."
  },
  ready: {
    range: [12, 16],
    level: "Ready",
    interpretation: "You’re likely ready to start the franchising process. Time to consult experts.",
    nextSteps: "Great! You're franchise-ready. Let’s help you design your franchise strategy, legal documents, and expansion plan."
  }
};

interface MessageBoxProps {
  title: string;
  content: string;
  onClose: () => void;
  isOpen: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ title, content, onClose, isOpen }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="overlay fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
        <div className="message-box fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 md:p-8 rounded-xl shadow-2xl z-50 flex flex-col items-center gap-4 text-center max-w-md w-11/12 max-h-[90vh] overflow-y-auto">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <p className="text-lg text-gray-700">{content}</p>
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
};

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, AnswerEntry>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [readinessLevel, setReadinessLevel] = useState('');
  const [nextSteps, setNextSteps] = useState('');
  const [currentSection, setCurrentSection] = useState(1);

  const [isMessageBoxOpen, setIsMessageBoxOpen] = useState(false);
  const [messageBoxTitle, setMessageBoxTitle] = useState('');
  const [messageBoxContent, setMessageBoxContent] = useState('');

  const handleAnswerChange = (questionIndex: number, selectedOption: Option) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: { text: selectedOption.text, points: selectedOption.points },
    }));
  };

  const handleSubmitQuiz = () => {
    const allAnswered = quizData.every((_, index) => answers[index] !== undefined);

    if (!allAnswered) {
      setMessageBoxTitle("Incomplete!");
      setMessageBoxContent("Please answer all questions before submitting.");
      setIsMessageBoxOpen(true);
      return;
    }

    let calculatedScore = 0;
    Object.values(answers).forEach(ans => {
      calculatedScore += ans.points;
    });

    setTotalScore(calculatedScore);

    if (calculatedScore <= scoringLogic.notReady.range[1]) {
      setReadinessLevel(scoringLogic.notReady.level);
      setNextSteps(scoringLogic.notReady.nextSteps);
    } else if (calculatedScore <= scoringLogic.somewhatReady.range[1]) {
      setReadinessLevel(scoringLogic.somewhatReady.level);
      setNextSteps(scoringLogic.somewhatReady.nextSteps);
    } else {
      setReadinessLevel(scoringLogic.ready.level);
      setNextSteps(scoringLogic.ready.nextSteps);
    }

    setQuizCompleted(true);
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setQuizCompleted(false);
    setTotalScore(0);
    setReadinessLevel('');
    setNextSteps('');
    setCurrentSection(1);
  };

  return (
    <div className="pt-16 md:pt-20 flex justify-center items-center min-h-screen bg-gray-100 p-5">
      {!quizCompleted ? (
        <div className="quiz-container bg-white rounded-[1.5rem] shadow-xl p-6 md:p-8 max-w-lg w-full flex flex-col gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800">Franchise Readiness Assessment</h1>

          <div id="quizQuestionsContainer" className="flex flex-col gap-6">
            {quizData
              .slice(currentSection === 1 ? 0 : 4, currentSection === 1 ? 4 : 8)
              .map((q, index) => {
                const actualIndex = currentSection === 1 ? index : index + 4;
                return (
                  <div key={actualIndex} className="bg-gray-50 rounded-xl p-5 shadow-md">
                    <p className="text-lg md:text-xl font-semibold mb-3 text-gray-800">{q.question}</p>
                    <p className="text-xs md:text-sm text-gray-500 mb-4">{q.description}</p>
                    {q.options.map((option, optIdx) => (
                      <label
                        key={optIdx}
                        className="flex items-center p-2 md:p-3 bg-white border border-gray-300 rounded-lg mb-2 md:mb-3 cursor-pointer hover:bg-blue-50 hover:border-blue-400"
                      >
                        <input
                          type="radio"
                          name={`question-${actualIndex}`}
                          value={option.text}
                          checked={answers[actualIndex]?.text === option.text}
                          onChange={() => handleAnswerChange(actualIndex, option)}
                          className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                        />
                        <span className="text-base md:text-lg text-gray-700">{option.text}</span>
                      </label>
                    ))}
                  </div>
                );
              })}
          </div>

          <div className="flex justify-between items-center mt-4">
            {currentSection > 1 && (
              <button
                onClick={() => setCurrentSection(currentSection - 1)}
                className="px-6 py-2 md:px-8 md:py-3 font-semibold rounded-full bg-gray-300 text-gray-800 hover:bg-gray-400 shadow-md"
              >
                Previous
              </button>
            )}
            {currentSection < 2 ? (
              <button
                onClick={() => setCurrentSection(currentSection + 1)}
                className="ml-auto px-6 py-2 md:px-8 md:py-3 font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="ml-auto px-6 py-2 md:px-8 md:py-3 font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
              >
                Submit Assessment
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="results-page bg-white rounded-[1.5rem] shadow-xl p-6 md:p-8 max-w-lg w-full flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Franchise Readiness Score</h2>
          <p className="text-xl font-semibold text-gray-700 mt-2">Your Total Score: {totalScore} points</p>
          <p className="text-lg text-gray-700 mt-1">{readinessLevel}</p>
          <p className="text-base text-gray-600 mb-6">{nextSteps}</p>

          <div className="flex flex-col gap-3 text-left">
            {quizData.map((q, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <p className="text-base font-semibold text-gray-800 mb-1">{q.question}</p>
                <p className="text-sm text-gray-700">Your Answer: {answers[index]?.text || 'Not Answered'}</p>
                <p className="text-sm font-medium text-green-600">Points: {answers[index]?.points ?? 0}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleRetakeQuiz}
            className="mx-auto mt-4 px-6 py-2 md:px-8 md:py-3 font-semibold rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md"
          >
            Retake Assessment
          </button>
        </div>
      )}

      <MessageBox 
        title={messageBoxTitle}
        content={messageBoxContent}
        isOpen={isMessageBoxOpen}
        onClose={() => setIsMessageBoxOpen(false)}
      />
    </div>
  );
}
