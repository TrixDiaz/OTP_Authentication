import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';
import { cookieUtils } from '@/lib/cookies';

export default function Password() {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ message, setMessage ] = useState<string>('');
    const navigate = useNavigate();
    const email = useAuthStore((state) => state.email);

    // Redirect if no email is available
    useEffect(() => {
        if (!email) {
            navigate('/login');
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
            // Add your password verification logic here
            // const response = await axios.post('http://localhost:3000/api/v1/auth/verify-password', {
            //     email: email,
            //     password: password
            // });

            setMessage('Password verified successfully!');
            toast.success('Password verified successfully!');

            // Store tokens in cookies if available
            // if (response.data.accessToken) {
            //     cookieUtils.setTokens(response.data.accessToken, response.data.refreshToken);
            // }

            // Navigate to dashboard or main app
            // navigate('/dashboard');
        } catch (error: any) {
            const errorMessage = 'Invalid password. Please try again.';
            setMessage(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [ email, navigate ]);

    if (!email) {
        return null; // Will redirect to login
    }

    return (
        <AuthCard
            title='Password'
            description='Enter your password to login'
            inputLabel='Password'
            inputType='password'
            inputPlaceholder='Password'
            backIcon={true}
            backIconTo="/other-ways"
            tooltip={true}
            tooltipText="Back to Other Ways to login"
            buttonText={isLoading ? 'Logging in...' : 'Login'}
            buttonVariant='default'
            linkText='Forgot password?'
            linkAction='Reset'
            linkTo='/forgot-password'
            showEmailBadge={true}
            onSubmit={handlePasswordSubmit}
            isLoading={isLoading}
            message={message}
        />
    );
} 