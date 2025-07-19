import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface AuthSubCardProps {
    title: string;
    description: string;
    backIcon: boolean;
    backIconTo?: string;
    userEmail: string;
    tooltip: boolean;
    tooltipText?: string;
    onSendCode?: () => void;
    isLoading?: boolean;
    message?: string;
}

export function AuthSubCard({
    title,
    description,
    backIcon,
    backIconTo,
    userEmail,
    tooltip,
    tooltipText,
    onSendCode,
    isLoading = false,
    message
}: AuthSubCardProps) {
    const navigate = useNavigate();

    const handleBackClick = () => {
        if (backIconTo) {
            navigate(backIconTo);
        }
    };

    const handleOtherWaysClick = () => {
        navigate("/other-ways");
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {/* Logo */}
                <div className="flex flex-row justify-between mb-8">
                    <Logo />
                    {backIcon && (
                        <button onClick={handleBackClick}>
                            {tooltip ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ArrowLeft className="w-6 h-6" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {tooltipText || ''}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <ArrowLeft className="w-6 h-6" />
                            )}
                        </button>
                    )}
                </div>

                {/* Badge */}
                <div className="text-center mb-4">
                    <Badge>{userEmail}</Badge>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-4 p-3 rounded-md text-sm text-center ${message.includes('successfully')
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Heading */}
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-700 text-sm">
                        {description} {userEmail}
                    </p>
                    <Button
                        className="w-full"
                        onClick={onSendCode}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Code'}
                    </Button>
                    <Button className="w-full" variant="ghost" onClick={handleOtherWaysClick}>
                        Other ways to login
                    </Button>
                </div>
            </div>
        </div>
    )
}