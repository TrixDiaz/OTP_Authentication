import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';
import { httpClient } from '@/lib/httpClient';

export default function Register() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const { setEmail, setFlowType } = useAuthStore();

    const handleRegistration = useCallback(async (email: string) => {
        if (!email) {
            setMessage('Please enter your email address');
            toast.error('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            toast.error('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // Check if user exists by trying to send registration OTP
            const response = await httpClient.post('/v1/auth/send-registration-otp', {
                email: email
            }, false); // Don't require auth for this request

            if (response.success) {
                // Store email and flow type in global state
                setEmail(email);
                setFlowType('register');

                setMessage('Registration OTP sent successfully! Check your email.');
                toast.success('Registration OTP sent successfully! Check your email.');

                // Redirect to OTP verification page
                setTimeout(() => {
                    navigate('/otp');
                }, 2000);
            } else {
                const errorMessage = response.message || 'Failed to send registration code. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error('Registration error:', error);

            // Check if it's a 409 error (user already exists)
            if (error.response?.status === 409) {
                // User already exists, redirect to login
                setMessage('Account already exists. Redirecting to login...');
                toast.warning('Account already exists. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                let errorMessage = 'An unexpected error occurred. Please try again.';

                if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [ navigate, setEmail, setFlowType ]);

    return (
        <AuthCard
            title="Create your account"
            description="Enter your email to register"
            inputLabel="Email"
            inputType="email"
            inputPlaceholder="Email"
            buttonText={isLoading ? 'Processing...' : 'Send code'}
            buttonVariant="default"
            linkText="Already have an account?"
            linkAction="Login"
            linkTo="/login"
            onSubmit={handleRegistration}
            isLoading={isLoading}
            message={message}
        />
    );
} 