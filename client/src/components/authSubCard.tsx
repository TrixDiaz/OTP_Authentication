import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
}

export function AuthSubCard({ title, description, backIcon, backIconTo, userEmail, tooltip, tooltipText }: AuthSubCardProps) {

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 border border-gray-200">
                {/* Logo */}
                <div className="flex flex-row justify-between mb-8">
                    <Logo />
                    {backIcon && (
                        <Link to={backIconTo || '/'}>
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
                        </Link>
                    )}
                </div>

                {/* Badge */}
                <div className="text-center mb-4">
                    <Badge>{userEmail}</Badge>
                </div>

                {/* Heading */}
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-semibold text-gray-900 mb-2">
                        {title}
                    </h1>
                    <p className="text-gray-700 text-sm">
                        {description} john.darlucio022@gmail.com
                    </p>
                    <Button className="w-full">Send Code</Button>
                    <Button className="w-full" variant="ghost">
                        <Link to="/other-ways">other ways to login</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}