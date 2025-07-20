import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';
import { httpClient } from '@/lib/httpClient';

export default function Otp() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const { email, flowType, setEmail, clearFlowType, setUser } = useAuthStore();

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
                ? '/auth/verify-registration-otp'
                : '/auth/verify-login-otp';

            const response = await httpClient.post(endpoint, {
                email: email,
                otp: otp
            }, false); // Don't require auth for this request

            // Handle successful response
            if (response.success) {
                const successMessage = flowType === 'register'
                    ? 'Registration successful!'
                    : 'Login successful!';

                setMessage(successMessage);
                toast.success(successMessage);

                // Store user data (tokens are now set as HTTP-only cookies by server)
                if (response.user) {
                    setUser(response.user);
                }

                // Clean up auth flow data - user is now authenticated
                setEmail('');
                clearFlowType();

                // Let the PublicRoute guard automatically redirect to home
                // since the user is now authenticated
            } else {
                const errorMessage = response.message || 'Invalid OTP. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            // Handle error response
            console.error('OTP verification error:', error);

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
    }, [ email, flowType, navigate, setEmail, clearFlowType, setUser ]);

    const handleResendOtp = useCallback(async () => {
        if (!email || !flowType) return;

        try {
            const endpoint = flowType === 'register'
                ? '/auth/send-registration-otp'
                : '/auth/send-login-otp';

            const response = await httpClient.post(endpoint, {
                email: email
            }, false); // Don't require auth for this request

            if (response.success) {
                setMessage('OTP resent successfully!');
                toast.success('OTP resent successfully!');
            } else {
                throw new Error(response.message || 'Failed to resend OTP');
            }
        } catch (error: any) {
            console.error('Resend OTP error:', error);
            const errorMessage = error.message || 'Failed to resend OTP. Please try again.';
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