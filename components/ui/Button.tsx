import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "clicky" | "paper" | "paperSecondary" | "keyboard" | "delete" | "icon" | "modal" | "modalAction";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
}

export default function Button({ 
    children, 
    variant = "clicky", 
    className = "", 
    ...props 
}: ButtonProps) {
    const baseClasses = "inline-flex items-center justify-center font-bold transition-colors duration-100 disabled:cursor-not-allowed cursor-pointer touch-manipulation";
    
    const variantClasses = {
        clicky: "rounded-sm bg-surface px-4 py-1.5 text-ink border-b-4 border-shadow active:translate-y-1 active:border-0 disabled:border-b-4 disabled:border-shadow disabled:translate-y-0 sm:px-6 sm:py-2",
        paper: "border-b-4 border-paper-ink bg-transparent px-4 py-2 text-xs text-paper-ink hover:bg-paper-ink hover:text-paper active:bg-paper-ink active:text-paper disabled:bg-transparent disabled:hover:bg-transparent disabled:hover:text-paper-ink disabled:opacity-50 sm:px-6 sm:text-base",
        paperSecondary: "border-b-4 border-paper-ink/40 bg-transparent px-3 py-2 text-xs text-paper-ink/70 hover:bg-divider hover:text-paper active:bg-divider active:text-paper disabled:bg-transparent disabled:hover:bg-transparent disabled:hover:text-paper-ink/70 disabled:opacity-50 sm:px-4 sm:text-base",
        keyboard: "font-typewriter h-12 w-8 rounded-full border-2 border-[#111] bg-tw-key text-lg text-[#111] shadow-[0_4px_0_#111] transition-all active:translate-y-1 active:shadow-[0_0_0_#111] sm:h-14 sm:w-12 sm:text-xl",
        delete: "font-typewriter h-12 w-14 rounded-full border-2 border-[#111] bg-stamp text-lg text-paper shadow-[0_4px_0_#111] active:translate-y-1 active:shadow-[0_0_0_#111] sm:h-14 sm:w-20 sm:text-xl",
        icon: "h-8 w-8 text-muted hover:text-accent",
        modal: "h-10 w-10 text-2xl leading-none text-ink hover:text-white",
        modalAction: "mt-4 w-full border-2 border-divider bg-canvas py-2 text-sm tracking-widest text-ink hover:border-accent hover:text-accent",
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