import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface User {
  id: number;
  name: string;
  email: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window !== 'undefined' && !this.initialized) {
      this.token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      this.user = userStr ? JSON.parse(userStr) : null;

      // Add request interceptor to include token
      api.interceptors.request.use((config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      });

      // Add response interceptor to handle 401 errors
      api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            this.logout();
          }
          return Promise.reject(error);
        }
      );

      this.initialized = true;
    }
  }

  async login(email: string, password: string) {
    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      if (response.data.token) {
        this.token = response.data.token;
        this.user = response.data.user;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.dispatchAuthChangeEvent();
      }

      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.dispatchAuthChangeEvent();
  }

  isAuthenticated(): boolean {
    // Ensure initialization is complete
    if (!this.initialized) {
      this.initialize();
    }
    return !!this.token;
  }

  getCurrentUser(): User | null {
    // Ensure initialization is complete
    if (!this.initialized) {
      this.initialize();
    }
    return this.user;
  }

  getToken(): string | null {
    // Ensure initialization is complete
    if (!this.initialized) {
      this.initialize();
    }
    return this.token;
  }

  private dispatchAuthChangeEvent() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('auth-change'));
    }
  }
}

export const authService = new AuthService();

// Export the axios instance for use in other services
export const authApi = api; 