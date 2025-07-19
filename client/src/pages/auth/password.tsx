import AuthCard from '@/components/authCard';

export default function Password() {
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
            buttonText='Login'
            buttonVariant='default'
            linkText='Forgot password?'
            linkAction='Reset'
            linkTo='/login'
            showEmailBadge={true}
        />
    );
} 