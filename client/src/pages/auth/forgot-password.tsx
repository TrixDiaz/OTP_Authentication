import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';
import { httpClient } from '@/lib/httpClient';

export default function ForgotPassword() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const { setEmail, setFlowType } = useAuthStore();

    const handleForgotPassword = useCallback(async (email: string) => {
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
            const response = await httpClient.post('/auth/send-password-reset-otp', {
                email: email
            }, false); // Don't require auth for this request

            if (response.success) {
                // Store email and set flow type for password reset
                setEmail(email);
                setFlowType('login'); // Use login flow for password reset

                setMessage('Password reset code sent successfully! Check your email.');
                toast.success('Password reset code sent successfully! Check your email.');

                // Navigate to OTP verification page
                setTimeout(() => {
                    navigate('/otp');
                }, 2000);
            } else {
                const errorMessage = response.message || 'Failed to send password reset code. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error('Forgot password error:', error);

            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [ navigate, setEmail, setFlowType ]);

    return (
        <AuthCard
            title="Forgot Password"
            description="Enter your email to reset your password"
            inputLabel="Email"
            inputType="email"
            inputPlaceholder="Enter your email"
            backIcon={true}
            backIconTo="/login"
            tooltip={true}
            tooltipText="Back to Login"
            buttonText={isLoading ? 'Sending...' : 'Reset Password'}
            buttonVariant="default"
            showEmailBadge={false}
            onSubmit={handleForgotPassword}
            isLoading={isLoading}
            message={message}
        />
    );
} 