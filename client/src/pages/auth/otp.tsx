import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import axios from 'axios';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';
import { cookieUtils } from '@/lib/cookies';

export default function Otp() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const { email, flowType, clearAll, clearFlowType } = useAuthStore();

    // Redirect if no email or flow type is available
    useEffect(() => {
        if (!email || !flowType) {
            navigate('/register');
        }
    }, [ email, flowType, navigate ]);

    const handleOtpVerification = useCallback(async (otp: string) => {
        if (!otp) {
            setMessage('Please enter the OTP code');
            toast.error('Please enter the OTP code');
            return;
        }

        if (!email || !flowType) {
            setMessage('Session expired. Please start again.');
            toast.error('Session expired. Please start again.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const endpoint = flowType === 'register'
                ? 'http://localhost:3000/api/v1/auth/verify-registration-otp'
                : 'http://localhost:3000/api/v1/auth/verify-login-otp';

            const response = await axios.post(endpoint, {
                email: email,
                otp: otp
            });

            // Handle successful response
            if (response.status === 200 || response.status === 201) {
                const successMessage = flowType === 'register'
                    ? 'Registration successful!'
                    : 'Login successful!';

                setMessage(successMessage);
                toast.success(successMessage);

                // Store tokens in cookies if available
                if (response.data.accessToken) {
                    cookieUtils.setTokens(response.data.accessToken, response.data.refreshToken);
                }

                // For registration, clear auth store immediately
                // For login, keep email in store briefly for home page, then clear
                if (flowType === 'register') {
                    clearAll();
                } else {
                    // Clear flow type but keep email for home page
                    clearFlowType();
                }

                // Redirect based on flow type
                setTimeout(() => {
                    if (flowType === 'register') {
                        navigate('/login'); // Redirect to login after successful registration
                    } else {
                        navigate('/dashboard'); // Redirect to dashboard after successful login
                    }
                }, 1500);
            }
        } catch (error: any) {
            // Handle error response
            if (error.response) {
                const errorMessage = error.response.data.message || 'Invalid OTP. Please try again.';
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
    }, [ email, flowType, navigate, clearAll ]);

    const handleResendOtp = useCallback(async () => {
        if (!email || !flowType) return;

        try {
            const endpoint = flowType === 'register'
                ? 'http://localhost:3000/api/v1/auth/send-registration-otp'
                : 'http://localhost:3000/api/v1/auth/send-login-otp';

            await axios.post(endpoint, {
                email: email
            });
            setMessage('OTP resent successfully!');
            toast.success('OTP resent successfully!');
        } catch (error) {
            const errorMessage = 'Failed to resend OTP. Please try again.';
            setMessage(errorMessage);
            toast.error(errorMessage);
        }
    }, [ email, flowType ]);

    if (!email || !flowType) {
        return null; // Will redirect
    }

    const backTo = flowType === 'register' ? '/register' : '/login';
    const title = flowType === 'register' ? 'Verify Registration' : 'Verify Login';
    const description = flowType === 'register'
        ? 'Enter the registration code sent to your email'
        : 'Enter the login code sent to your email';

    return (
        <AuthCard
            title={title}
            description={description}
            inputLabel='OTP Code'
            inputType='text'
            inputPlaceholder='Enter 6 Digit OTP Code'
            backIcon={true}
            backIconTo={backTo}
            tooltip={true}
            tooltipText={`Back to ${flowType === 'register' ? 'Registration' : 'Login'}`}
            buttonText={isLoading ? 'Verifying...' : 'Verify'}
            buttonVariant='default'
            linkText='Resend OTP?'
            linkAction='Resend'
            linkTo={backTo}
            showEmailBadge={true}
            onSubmit={handleOtpVerification}
            isLoading={isLoading}
            message={message}
        />
    );
} 