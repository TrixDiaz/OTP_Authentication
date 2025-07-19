import { AuthSubCard } from "@/components/authSubCard"
import { Logo } from "@/components/logo"

export default function OtherWays() {
    return (
       <div>
            <AuthSubCard 
                title="Other ways to sign in"
                description="Enter the code sent to your email"
                backIcon={true}
                tooltip={true}
                tooltipText="Back to Send Code"
                backIconTo="/send-code"
                userEmail="john.darlucio022@gmail.com"
        />
       </div>
    )
}

