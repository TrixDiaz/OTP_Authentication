import { AuthSubCard } from "@/components/authSubCard"

export default function SendCode() {
    return (
        <div>
            <AuthSubCard
                title="Get a code to sign in"
                description="Enter the code sent to your email"
                backIcon={true}
                backIconTo="/login"
                tooltip={true}
                tooltipText="Back to Login"
                userEmail="john.darlucio022@gmail.com"
            />
        </div>
    )
}

