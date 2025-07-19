import  AuthCard  from '@/components/authCard';

export default function Pin() {
   
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
            buttonText='Submit'
            buttonVariant='default'
            linkText='Forgot PIN?'
            linkAction='Reset'
            linkTo='/login'
            showEmailBadge={true}
        />
    );
} 