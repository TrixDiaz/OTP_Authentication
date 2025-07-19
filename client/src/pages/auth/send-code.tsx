import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from 'sonner';
import { AuthSubCard } from "@/components/authSubCard";
import { useAuthStore } from "@/lib/authStore";
import { httpClient } from '@/lib/httpClient';

export default function SendCode() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const { email, flowType } = useAuthStore();
    const navigate = useNavigate();

    // Redirect to register if no email or flow type is available
    useEffect(() => {
        if (!email || !flowType) {
            navigate('/register');
        }
    }, [ email, flowType, navigate ]);

    const handleSendCode = useCallback(async () => {
        if (!email || !flowType) {
            const errorMessage = 'Session expired. Please start again.';
            setMessage(errorMessage);
            toast.error(errorMessage);
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const endpoint = flowType === 'register'
                ? '/v1/auth/send-registration-otp'
                : '/v1/auth/send-login-otp';

            const response = await httpClient.post(endpoint, {
                email: email
            }, false); // Don't require auth for this request

            // Handle successful response
            if (response.success) {
                const successMessage = flowType === 'register'
                    ? 'Registration OTP sent successfully! Check your email.'
                    : 'Login OTP sent successfully! Check your email.';

                setMessage(successMessage);
                toast.success(successMessage);

                // Navigate to OTP verification page
                setTimeout(() => {
                    navigate('/otp');
                }, 2000);
            } else {
                const errorMessage = response.message || 'Failed to send code. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error('Send code error:', error);

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
    }, [ email, flowType, navigate ]);

    if (!email || !flowType) {
        return null; // Will redirect to register
    }

    const backTo = flowType === 'register' ? '/register' : '/login';
    const title = flowType === 'register'
        ? 'Get a code to complete registration'
        : 'Get a code to sign in';

    return (
        <div>
            <AuthSubCard
                title={title}
                description="We'll send a verification code to"
                backIcon={true}
                backIconTo={backTo}
                tooltip={true}
                tooltipText={`Back to ${flowType === 'register' ? 'Registration' : 'Login'}`}
                userEmail={email}
                onSendCode={handleSendCode}
                isLoading={isLoading}
                message={message}
            />
        </div>
    );
}

