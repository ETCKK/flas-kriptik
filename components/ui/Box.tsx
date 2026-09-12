import { HTMLAttributes, ReactNode } from "react";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    variant?: "accent" | "shadow" | "danger" | "divider";
}

export default function Box({ 
    children, 
    variant = "accent", 
    className = "", 
    ...props 
}: BoxProps) {
    const variantClasses = {
        accent: "border-accent shadow-[6px_6px_0_var(--color-accent)]",
        shadow: "border-shadow shadow-[6px_6px_0_var(--color-shadow)]",
        danger: "border-danger shadow-[6px_6px_0_var(--color-danger)]",
        divider: "border-divider shadow-[6px_6px_0_var(--color-divider)]",
    };

    return (
        <div 
            className={`relative w-full rounded-sm border-2 bg-surface p-5 text-ink ${variantClasses[variant]} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}