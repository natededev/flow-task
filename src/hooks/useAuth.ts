import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { User } from '@/types';
import { useClientStore } from '@/store/clientStore';

// React Query keys
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
} as const;

// Auth hooks using React Query
export function useAuth() {
  const queryClient = useQueryClient();
  const { isAuthenticated, setAuth, clearAuth } = useClientStore();

  // Get current user
  const { data: user, isLoading } = useQuery({
    queryKey: authKeys.me(),
    queryFn: () => authApi.me().then(res => res.data),
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes - increased for better performance
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (response) => {
      setAuth(response.data);
      queryClient.setQueryData(authKeys.me(), response.data);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      authApi.register(email, password, name),
    onSuccess: (response) => {
      setAuth(response.data);
      queryClient.setQueryData(authKeys.me(), response.data);
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
    },
  });

  return {
    // State
    user: user || null,
    isAuthenticated,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    
    // Actions
    login: async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ email, password });
      return result.data;
    },
    
    register: async (email: string, password: string, name: string) => {
      const result = await registerMutation.mutateAsync({ email, password, name });
      return result.data;
    },
    
    logout: () => logoutMutation.mutate(),
    
    // Mutation states
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}