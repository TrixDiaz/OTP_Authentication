import viteLogo from '/vite.svg'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    color?: 'default' | 'primary' | 'white' | 'muted';
    className?: string;
    showText?: boolean;
    title?: string;
}

export const Logo = ({
    size = 'md',
    color = 'default',
    className = '',
    showText = true,
    title = 'Fastlink'
}: LogoProps) => {
    const sizeClasses = {
        sm: 'text-lg',
        md: 'text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl'
    };

    const colorClasses = {
        default: 'text-foreground',
        primary: 'text-primary',
        white: 'text-white',
        muted: 'text-muted-foreground'
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            {/* Logo Icon/Symbol */}
            <div>
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </div>

            {/* Logo Text */}
            {showText && (
                <span className={`
          ${sizeClasses[ size ]} 
          ${colorClasses[ color ]} 
          font-bold 
          tracking-tight
        `}>
                    {title}
                </span>
            )}
        </div>
    );
}; 