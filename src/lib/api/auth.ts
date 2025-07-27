import { User } from '@/types';
import { ApiResponse, delay } from './base.ts';

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'admin@example.com',
  role: 'admin',
  avatar: null, // Remove external image to avoid network delay
  createdAt: new Date(),
  updatedAt: new Date()
};

// Simple token storage simulation
let currentToken: string | null = null;

export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse<User>> {
    await delay(200); // Reduced delay for better performance
    
    // Simulate authentication logic
    if (email === 'admin@example.com' && password === 'password') {
      currentToken = 'mock-jwt-token-' + Date.now();
      return { 
        data: mockUser, 
        success: true, 
        message: 'Login successful' 
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async register(email: string, password: string, name: string): Promise<ApiResponse<User>> {
    await delay(200); // Reduced delay for better performance
    
    // Simulate registration logic
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    currentToken = 'mock-jwt-token-' + Date.now();
    return { 
      data: newUser, 
      success: true, 
      message: 'Registration successful' 
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(100); // Reduced delay for better performance
    currentToken = null;
    return { 
      data: null, 
      success: true, 
      message: 'Logout successful' 
    };
  },

  async me(): Promise<ApiResponse<User>> {
    await delay(100); // Reduced delay for better performance
    
    if (!currentToken) {
      throw new Error('Not authenticated');
    }
    
    return { 
      data: mockUser, 
      success: true 
    };
  },

  // Utility function to check if user is authenticated
  isAuthenticated(): boolean {
    return currentToken !== null;
  },

  // Get current token
  getToken(): string | null {
    return currentToken;
  }
};
