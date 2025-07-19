import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';

interface AuthCardProps {
    title: string;
    description?: string;
    buttonText: string;
    inputLabel?: string;
    backIcon?: boolean;
    backIconTo?: string;
    tooltip?: boolean;
    tooltipText?: string;
    inputType?: string;
    inputPlaceholder?: string;
    buttonVariant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
    linkText?: string;
    linkAction?: string;
    linkTo?: string;
    showEmailBadge?: boolean;
    showOtherWays?: boolean;
    otherWaysTo?: string;
    onSubmit?: (email: string) => void;
    onToggleMode?: () => void;
    isLoading?: boolean;
    message?: string;
}

export default function AuthCard({
    title,
    description,
    buttonText,
    inputLabel,
    inputType,
    backIcon,
    backIconTo,
    tooltip,
    tooltipText,
    inputPlaceholder,
    buttonVariant = 'default',
    linkText,
    linkAction,
    linkTo,
    showEmailBadge = false,
    showOtherWays = false,
    otherWaysTo,
    onSubmit,
    isLoading = false,
    message,
}: AuthCardProps) {
    const [ email, setEmail ] = useState('');
    const navigate = useNavigate();
    const storedEmail = useAuthStore((state) => state.email);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(email);
        }
    };

    const handleBackClick = () => {
        if (backIconTo) {
            navigate(backIconTo);
        }
    };

    const handleLinkClick = () => {
        if (linkTo) {
            navigate(linkTo);
        }
    };

    const handleOtherWaysClick = () => {
        if (otherWaysTo) {
            navigate(otherWaysTo);
        }
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

                {/* Heading */}
                <div className="mb-8 text-center">
                    {showEmailBadge && storedEmail && (
                        <Badge variant="secondary" className='mb-2 text-xs'>{storedEmail}</Badge>
                    )}
                    <p className="text-3xl font-light text-gray-900 mb-2">
                        {title}
                    </p>
                    {description && <p className="text-gray-700">{description}</p>}
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-4 p-3 rounded-md text-sm ${message.includes('successfully')
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="">
                            {inputLabel}
                        </Label>
                        <Input
                            id="email"
                            type={inputType}
                            placeholder={inputPlaceholder}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            className="w-full h-10 px-3 border border-gray-300 rounded-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-500"
                        />
                    </div>

                    {linkText && linkAction && (
                        <div className="text-sm">
                            <span className="text-gray-700">{linkText}&nbsp;</span>
                            <button
                                type="button"
                                onClick={handleLinkClick}
                                className="text-blue-600 hover:underline font-normal bg-transparent border-none cursor-pointer"
                            >
                                {linkAction}
                            </button>
                        </div>
                    )}

                    {showOtherWays && (
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleOtherWaysClick}
                                className="text-blue-600 hover:underline text-sm font-normal bg-transparent border-none cursor-pointer"
                            >
                                Other ways to sign in
                            </button>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button
                            type='submit'
                            variant={buttonVariant}
                            className="w-32"
                            disabled={isLoading}
                        >
                            {buttonText}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}