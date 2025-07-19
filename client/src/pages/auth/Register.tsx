import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';

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
            const response = await axios.post('http://localhost:3000/api/v1/auth/send-registration-otp', {
                email: email
            });

            if (response.status === 200 || response.status === 201) {
                // Store email and flow type in global state
                setEmail(email);
                setFlowType('register');

                setMessage('Registration OTP sent successfully! Check your email.');
                toast.success('Registration OTP sent successfully! Check your email.');
                // Redirect to OTP verification page
                setTimeout(() => {
                    navigate('/otp');
                }, 2000);
            }
        } catch (error: any) {
            if (error.response?.status === 409) {
                // User already exists, redirect to login
                setMessage('Account already exists. Redirecting to login...');
                toast.warning('Account already exists. Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else if (error.response) {
                const errorMessage = error.response.data.message || 'Failed to send registration code. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            } else if (error.request) {
                const errorMessage = 'Network error. Please check your connection.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            } else {
                const errorMessage = 'An unexpected error occurred. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [ navigate, setEmail, setFlowType ]);

    return (
        <AuthCard
            title='Create your account'
            description='Enter your email to register'
            inputLabel='Email'
            inputType='email'
            inputPlaceholder='Email'
            buttonText={isLoading ? 'Processing...' : 'Send code'}
            buttonVariant='default'
            linkText='Already have an account?'
            linkAction='Login'
            linkTo='/login'
            onSubmit={handleRegistration}
            isLoading={isLoading}
            message={message}
        />
    );
} 