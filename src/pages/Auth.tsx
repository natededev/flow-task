import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/Auth/LoginForm';
import { RegisterForm } from '@/components/Auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';

export const Auth = () => {
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">TaskFlow</h1>
          <p className="text-muted-foreground">
            Streamline your productivity with modern task management
          </p>
        </div>
        
        {isLogin ? (
          <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};