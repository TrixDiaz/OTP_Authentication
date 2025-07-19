import AuthCard from '@/components/authCard';

export default function ForgotPassword() {

    return (
        <AuthCard
            title='Forgot Password'
            description='Enter your email to reset your password'
            inputLabel='Email'
            inputType='text'
            inputPlaceholder='Enter your email'
            backIcon={true}
            backIconTo="/login"
            tooltip={true}
            tooltipText="Back to Login"
            buttonText='Reset Password'
            buttonVariant='default'
            showEmailBadge={true}
        />
    );
} 