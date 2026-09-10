import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "clicky";
}

export default function Button({ 
    children, 
    variant = "clicky", 
    className = "", 
    ...props 
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center rounded-sm px-4 py-1.5 font-bold transition-all duration-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation sm:px-6 sm:py-2";
    
    const variantClasses = {
        clicky: "bg-surface text-ink border-b-4 border-shadow active:translate-y-1 active:border-0 disabled:border-b-4 disabled:border-shadow disabled:translate-y-0",
    };

    return (
        <button 
            autoComplete="off"
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}