import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from 'sonner';
import axios from "axios";
import { AuthSubCard } from "@/components/authSubCard";
import { useAuthStore } from "@/lib/authStore";

export default function SendCode() {
    console.log('SendCode component rendering...');

    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const { email, flowType } = useAuthStore();
    const navigate = useNavigate();

    console.log('SendCode state:', { email, flowType, navigate: typeof navigate });

    // Redirect to register if no email or flow type is available
    useEffect(() => {
        if (!email || !flowType) {
            console.log('Missing email or flowType, redirecting to register');
            if (navigate && typeof navigate === 'function') {
                navigate('/register');
            }
        }
    }, [ email, flowType, navigate ]);

    const handleSendCode = useCallback(() => {
        console.log('handleSendCode called with:', { email, flowType });

        if (!email || !flowType) {
            const errorMessage = 'Session expired. Please start again.';
            setMessage(errorMessage);
            toast.error(errorMessage);
            return;
        }

        setIsLoading(true);
        setMessage('');

        const performAsyncOperation = async () => {
            try {
                const endpoint = flowType === 'register'
                    ? 'http://localhost:3000/api/v1/auth/send-registration-otp'
                    : 'http://localhost:3000/api/v1/auth/send-login-otp';

                console.log('Making request to:', endpoint);

                const response = await axios.post(endpoint, {
                    email: email
                }, {
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log('Response received:', response.status);

                // Handle successful response
                if (response.status === 200 || response.status === 201) {
                    const successMessage = flowType === 'register'
                        ? 'Registration OTP sent successfully! Check your email.'
                        : 'Login OTP sent successfully! Check your email.';

                    setMessage(successMessage);
                    toast.success(successMessage);

                    // Navigate to OTP verification page
                    setTimeout(() => {
                        try {
                            if (navigate && typeof navigate === 'function') {
                                console.log('Navigating to /otp');
                                navigate('/otp');
                            } else {
                                console.error('Navigate function not available');
                            }
                        } catch (navError) {
                            console.error('Navigation error:', navError);
                        }
                    }, 2000);
                }
            } catch (error: any) {
                console.error('Send code error:', error);

                // Handle error response
                let errorMessage = 'An unexpected error occurred. Please try again.';

                if (error?.response) {
                    // Server responded with error status
                    errorMessage = error.response.data?.message || 'Failed to send code. Please try again.';
                } else if (error?.request) {
                    // Network error
                    errorMessage = 'Network error. Please check your connection.';
                } else if (error?.message) {
                    errorMessage = error.message;
                }

                setMessage(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        // Execute the async operation
        performAsyncOperation().catch((error) => {
            console.error('Async operation failed:', error);
            setIsLoading(false);
            setMessage('Failed to send code. Please try again.');
            toast.error('Failed to send code. Please try again.');
        });
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

