import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';

export default function Password() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const { email, setEmail, clearFlowType, setUser } = useAuthStore();

    // Redirect if no email is available
    useEffect(() => {
        if (!email) {
            navigate('/login', { replace: true });
        }
    }, [ email, navigate ]);

    const handlePasswordSubmit = useCallback(async (password: string) => {
        if (!password) {
            setMessage('Please enter your password');
            toast.error('Please enter your password');
            return;
        }

        if (!email) {
            setMessage('Email is required. Please login again.');
            toast.error('Email is required. Please login again.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            // TODO: Implement password verification API call when server endpoint is ready
            // const response = await httpClient.post('/auth/verify-password', {
            //     email: email,
            //     password: password
            // }, false);

            // Mock successful response for now
            const mockResponse = {
                success: true,
                message: 'Password verification successful',
                accessToken: 'mock-access-token-password-' + Date.now(),
                refreshToken: 'mock-refresh-token-password-' + Date.now(),
                user: {
                    id: 'mock-user-id',
                    email: email,
                    name: email.split('@')[ 0 ],
                    isVerified: true,
                    profileCompleted: false,
                    hasCompletedProfile: false,
                    createdAt: new Date().toISOString()
                }
            };

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            if (mockResponse.success) {
                setMessage('Password verification successful!');
                toast.success('Password verification successful!');

                // Store user data (tokens would be set as HTTP-only cookies by server)
                if (mockResponse.user) {
                    setUser(mockResponse.user);
                }

                // Clean up auth flow data
                setEmail('');
                clearFlowType();

                // Let the PublicRoute guard automatically redirect to home
                // since the user is now authenticated
            } else {
                const errorMessage = mockResponse.message || 'Invalid password. Please try again.';
                setMessage(errorMessage);
                toast.error(errorMessage);
            }
        } catch (error: any) {
            console.error('Password verification error:', error);

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
    }, [ email, navigate, setEmail, clearFlowType, setUser ]);

    if (!email) {
        return null; // Will redirect
    }

    return (
        <AuthCard
            title="Enter your Password"
            description="Use your account password to sign in"
            inputLabel="Password"
            inputType="password"
            inputPlaceholder="Enter your password"
            backIcon={true}
            backIconTo="/other-ways"
            tooltip={true}
            tooltipText="Back to Other Ways"
            buttonText={isLoading ? 'Verifying...' : 'Sign In'}
            buttonVariant="default"
            linkText="Forgot your password?"
            linkAction="Reset Password"
            linkTo="/forgot-password"
            showEmailBadge={true}
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
            message={message}
        />
    );
} 