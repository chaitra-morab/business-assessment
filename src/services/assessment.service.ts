import axios from 'axios';

const API_URL = '/api/assessment';
const REQUEST_TIMEOUT = 8000; // 8 seconds timeout

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    return Promise.reject(error);
  }
);

export interface AssessmentOption {
  id: number;
  option_text: string;
  score: number;
}

export interface AssessmentQuestion {
  id: number;
  question_text: string;
  is_multiple: boolean;
  weight: number;
  options: AssessmentOption[];
}

export interface QuestionsByDimension {
  [key: string]: AssessmentQuestion[];
}

export interface AssessmentResponse {
  questionId: number;
  selectedOptionIds: number[];
}

export interface AssessmentResult {
  success: boolean;
  message: string;
  score: number;
  status: string;
}

export interface AssessmentHistoryItem {
  date: string;
  score: number;
  status: string;
  color: string;
  totalQuestions: number;
  dimensions: string[];
}

export const assessmentService = {
  // Get all questions for the assessment
  getQuestions: async (questionnaireId: number = 1) => {
    try {
      console.log('Fetching questions...');
      const response = await api.get(`/questions?questionnaire_id=${questionnaireId}`);
      const data = response.data as QuestionsByDimension;
      console.log('Questions received:', {
        dimensions: Object.keys(data),
        totalQuestions: Object.values(data).reduce((acc, curr) => acc + curr.length, 0)
      });
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },

  // Submit assessment responses
  submitAssessment: async (responses: AssessmentResponse[], questionnaireId: number = 1, userId?: number | string) => {
    try {
      console.log('Submitting assessment responses:', responses);
      // Validate responses before submitting
      const validationError = validateResponses(responses);
      if (validationError) {
        console.error('Validation error:', validationError);
        throw new Error(validationError);
      }
      const response = await api.post('/submit', { responses, questionnaire_id: questionnaireId, user_id: userId });
      console.log('Assessment submitted successfully:', response.data);
      return response.data as AssessmentResult;
    } catch (error) {
      console.error('Error submitting assessment:', error);
      throw error;
    }
  },

  // Get assessment history
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data as AssessmentHistoryItem[];
  }
};

// Helper function to validate responses
function validateResponses(responses: AssessmentResponse[]): string | null {
  if (!responses || responses.length === 0) {
    return 'No responses provided';
  }
  for (const response of responses) {
    if (!response.questionId || !response.selectedOptionIds || response.selectedOptionIds.length === 0) {
      return `Invalid response for question ${response.questionId}`;
    }
    // Special handling for multi-select questions (5, 8, 14)
    if ([5, 8, 14].includes(response.questionId)) {
      const selectedIds = response.selectedOptionIds;
      // Check if "None" option is selected along with others
      const hasNone = selectedIds.some(id => {
        // These IDs correspond to "None" options in questions 5, 8, and 14
        const noneOptionIds = new Set([20, 40, 70]);
        return noneOptionIds.has(id);
      });
      if (hasNone && selectedIds.length > 1) {
        return 'Cannot select "None" along with other options';
      }
      // Question 5: Maximum 2 selections (excluding "None" option)
      if (response.questionId === 5 && !hasNone && selectedIds.length > 2) {
        return 'Question 5 allows maximum of 2 selections';
      }
    }
  }
  return null;
} 