import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const spinnerVariants = cva(
    "animate-spin rounded-full border-2 border-solid border-current border-r-transparent",
    {
        variants: {
            size: {
                sm: "h-4 w-4",
                md: "h-6 w-6",
                lg: "h-8 w-8",
            },
        },
        defaultVariants: {
            size: "md",
        },
    }
);

export interface SpinnerProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className, size, ...props }, ref) => {
        return (
            <div className="flex flex-col items-center gap-2" ref={ref} {...props}>
                <div className={cn(spinnerVariants({ size, className }))} />
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        );
    }
);

Spinner.displayName = "Spinner";

export { Spinner };