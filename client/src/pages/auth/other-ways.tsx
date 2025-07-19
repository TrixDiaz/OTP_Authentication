import { useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from 'sonner';
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuthStore } from "@/lib/authStore";

export default function OtherWays() {
    const navigate = useNavigate();
    const email = useAuthStore((state) => state.email);

    // Redirect if no email is available
    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [ email, navigate ]);

    const handleBackClick = () => {
        navigate("/send-code");
    };

    const handlePinClick = () => {
        toast.info('Redirecting to PIN verification...');
        navigate("/pin");
    };

    const handlePasswordClick = () => {
        toast.info('Redirecting to password verification...');
        navigate("/password");
    };

    if (!email) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {/* Logo */}
                <div className="flex flex-row justify-between mb-8">
                    <Logo />
                    <button onClick={handleBackClick}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <ArrowLeft className="w-6 h-6" />
                            </TooltipTrigger>
                            <TooltipContent>
                                Back to Send Code
                            </TooltipContent>
                        </Tooltip>
                    </button>
                </div>

                {/* Badge */}
                <div className="text-center mb-4">
                    <Badge>{email}</Badge>
                </div>

                {/* Heading */}
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-6">
                        Sign in other ways
                    </h1>

                    {/* PIN and Password Buttons */}
                    <div className="space-y-3">
                        <Button
                            className="w-full h-12"
                            variant="outline"
                            onClick={handlePinClick}
                        >
                            Use your Security PIN
                        </Button>

                        <Button
                            className="w-full h-12"
                            variant="outline"
                            onClick={handlePasswordClick}
                        >
                            Use your Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

