import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';

export default function ForgotPassword() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const setEmail = useAuthStore((state) => state.setEmail);

    const handleForgotPassword = useCallback(async (email: string) => {
        if (!email) {
            setMessage('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('http://localhost:3000/api/v1/auth/send-password-reset-otp', {
                email: email
            });

            if (response.status === 200 || response.status === 201) {
                // Store email in global state
                setEmail(email);
                setMessage('Password reset code sent successfully! Check your email.');

                // Navigate to OTP verification page
                setTimeout(() => {
                    navigate('/otp');
                }, 2000);
            }
        } catch (error: any) {
            if (error.response) {
                setMessage(error.response.data.message || 'Failed to send password reset code. Please try again.');
            } else if (error.request) {
                setMessage('Network error. Please check your connection.');
            } else {
                setMessage('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [ navigate, setEmail ]);

    return (
        <AuthCard
            title='Forgot Password'
            description='Enter your email to reset your password'
            inputLabel='Email'
            inputType='email'
            inputPlaceholder='Enter your email'
            backIcon={true}
            backIconTo="/login"
            tooltip={true}
            tooltipText="Back to Login"
            buttonText={isLoading ? 'Sending...' : 'Reset Password'}
            buttonVariant='default'
            showEmailBadge={false}
            onSubmit={handleForgotPassword}
            isLoading={isLoading}
            message={message}
        />
    );
} 