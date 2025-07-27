// Base types and utilities for API modules
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}

// Utility function to simulate network delay - reduced for better performance
export const delay = (ms: number = 100): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Simulate random errors for testing
export const simulateError = (errorRate: number = 0.1): void => {
  if (Math.random() < errorRate) {
    throw new Error('Simulated network error');
  }
};
