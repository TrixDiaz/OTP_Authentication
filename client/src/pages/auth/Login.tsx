import AuthCard from '@/components/authCard';

export default function Login() {
    return (
        <AuthCard
          title="Sign in to your account"
          description="Enter your email and password to login"
          inputLabel="Email or Username"
          inputType="text"
          inputPlaceholder="Email or Username"
          buttonText="Next"
          buttonVariant="default"
          linkText="Don't have an account?"
          linkAction="Register"
          linkTo="/register"
        />
    );
}