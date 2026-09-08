import { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "solid" | "outline" | "danger" | "ghost" | "clicky";
}

export default function Button({ 
    children, 
    variant = "solid", 
    className = "", 
    ...props 
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center rounded-sm px-6 py-2 font-bold transition-all duration-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 active:translate-y-0.5 cursor-pointer touch-manipulation";
    
    const variantClasses = {
        solid: "bg-accent text-surface border-2 border-accent hover:bg-ink hover:border-ink hover:text-surface",
        outline: "bg-surface text-accent border-2 border-accent hover:bg-accent hover:text-surface",
        danger: "bg-danger text-ink border-2 border-danger hover:brightness-110",
        ghost: "bg-transparent text-ink hover:bg-canvas/20",
        clicky: "bg-surface text-ink border-b-4 border-shadow active:translate-y-1 active:border-0",
    };

    return (
        <button 
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}