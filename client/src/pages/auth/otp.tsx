import AuthCard from '@/components/authCard';

export default function Otp() {
    return (
        <AuthCard
            title='OTP Code'
            description='Enter the code sent to your email'
            inputLabel='OTP Code'
            inputType='text'
            inputPlaceholder='Enter 6 Digit OTP Code'
            backIcon={true}
            backIconTo="/send-code"
            tooltip={true}
            tooltipText="Back to Send Code"
            buttonText='Verify'
            buttonVariant='default'
            linkText='Resend OTP?'
            linkAction='Resend'
            linkTo='/login'
            showEmailBadge={true}
        />
    );
} 