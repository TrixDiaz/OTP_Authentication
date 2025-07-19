import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';

export default function Login() {
  const [ message, setMessage ] = useState<string>('');
  const navigate = useNavigate();
  const { setEmail, setFlowType } = useAuthStore();

  const handleLogin = useCallback(async (emailOrUsername: string) => {
    if (!emailOrUsername) {
      setMessage('Please enter your email or username');
      toast.error('Please enter your email or username');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailOrUsername)) {
      setMessage('Please enter a valid email address');
      toast.error('Please enter a valid email address');
      return;
    }

    // Store email and flow type
    setEmail(emailOrUsername);
    setFlowType('login');

    toast.success('Email verified! Redirecting to send code...');
    // Navigate to send-code page
    navigate('/send-code');
  }, [ navigate, setEmail, setFlowType ]);

  return (
    <AuthCard
      title="Sign in to your account"
      description="Enter your email to continue"
      inputLabel="Email or Username"
      inputType="text"
      inputPlaceholder="Email or Username"
      buttonText="Continue"
      buttonVariant="default"
      linkText="Don't have an account?"
      linkAction="Register"
      linkTo="/register"
      onSubmit={handleLogin}
      isLoading={false}
      message={message}
      showOtherWays={false}
    />
  );
}