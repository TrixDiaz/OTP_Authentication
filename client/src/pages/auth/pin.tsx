import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import AuthCard from '@/components/authCard';
import { useAuthStore } from '@/lib/authStore';
import { cookieUtils } from '@/lib/cookies';

export default function Pin() {
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

    const handlePinSubmit = useCallback(async (pin: string) => {
        if (!pin) {
            setMessage('Please enter your Security PIN');
            toast.error('Please enter your Security PIN');
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
            // Add your PIN verification logic here
            // const response = await axios.post('http://localhost:3000/api/v1/auth/verify-pin', {
            //     email: email,
            //     pin: pin
            // });

            setMessage('PIN verified successfully!');
            toast.success('PIN verified successfully!');

            // Store tokens in cookies if available
            // if (response.data.accessToken) {
            //     cookieUtils.setTokens(response.data.accessToken, response.data.refreshToken);
            // }

            // Navigate to dashboard or main app
            // navigate('/dashboard');
        } catch (error: any) {
            const errorMessage = 'Invalid PIN. Please try again.';
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
            title='Security PIN'
            description='Enter your Security PIN to login'
            inputLabel='Security PIN'
            inputType='text'
            inputPlaceholder='Enter your 12 Combinations Digit PIN'
            backIcon={true}
            backIconTo="/other-ways"
            tooltip={true}
            tooltipText="Back to Other Ways to login"
            buttonText={isLoading ? 'Submitting...' : 'Submit'}
            buttonVariant='default'
            linkText='Forgot PIN?'
            linkAction='Reset'
            linkTo='/login'
            showEmailBadge={true}
            onSubmit={handlePinSubmit}
            isLoading={isLoading}
            message={message}
        />
    );
} 