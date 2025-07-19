import  AuthCard  from '@/components/authCard';

export default function Register() {
    return (
        <AuthCard
           title='Create your account'
           description='Enter your email and password to register'
           inputLabel='Email'
           inputType='email'
           inputPlaceholder='Email'
           buttonText='Create account'
           buttonVariant='default'
           linkText='Already have an account?'
           linkAction='Login'
           linkTo='/login'
        />
    );
} 