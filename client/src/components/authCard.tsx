import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ArrowLeft } from 'lucide-react';

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
    onSubmit?: (email: string) => void;
    onToggleMode?: () => void;
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
}: AuthCardProps) {


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
                {/* Heading */}
                <div className="mb-8 text-center">
                    {showEmailBadge && (
                        <Badge variant="secondary" className='mb-2 text-xs'>john.darlucio022@gmail.com</Badge>
                    )}
                    <p className="text-3xl font-light text-gray-900 mb-2">
                        {title}
                    </p>
                    {description && <p className="text-gray-700">{description}</p>}
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="">
                            {inputLabel}
                        </Label>
                        <Input
                            id="email"
                            type={inputType}
                            placeholder={inputPlaceholder}
                            className="w-full h-10 px-3 border border-gray-300 rounded-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 placeholder:text-gray-500"
                        />
                    </div>

                    {linkText && linkAction && (
                        <div className="text-sm">
                            <span className="text-gray-700">{linkText}&nbsp;</span>
                            <Link
                                to={linkTo || '/'}
                                className="text-blue-600 hover:underline font-normal bg-transparent border-none cursor-pointer"
                            >
                                {linkAction}
                            </Link>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type='submit' variant={buttonVariant} className="w-32">
                            {buttonText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}