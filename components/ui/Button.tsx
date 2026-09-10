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
        paper: "border-b-4 border-[var(--color-paper-ink)] bg-transparent px-4 py-2 text-xs text-[var(--color-paper-ink)] hover:bg-[var(--color-paper-ink)] hover:text-[var(--color-paper)] active:bg-[var(--color-paper-ink)] active:text-[var(--color-paper)] disabled:bg-transparent disabled:hover:bg-transparent disabled:hover:text-[var(--color-paper-ink)] disabled:opacity-50 sm:px-6 sm:text-base",
        paperSecondary: "border-b-4 border-[var(--color-paper-ink)]/40 bg-transparent px-3 py-2 text-xs text-[var(--color-paper-ink)]/70 hover:bg-[var(--color-divider)] hover:text-[var(--color-paper)] active:bg-[var(--color-divider)] active:text-[var(--color-paper)] disabled:bg-transparent disabled:hover:bg-transparent disabled:hover:text-[var(--color-paper-ink)]/70 disabled:opacity-100 sm:px-4 sm:text-base",
        keyboard: "font-typewriter h-12 w-8 rounded-full border-2 border-[#111] bg-[var(--color-tw-key)] text-lg text-[#111] shadow-[0_4px_0_#111] transition-all active:translate-y-1 active:shadow-[0_0_0_#111] sm:h-14 sm:w-12 sm:text-xl",
        delete: "font-typewriter h-12 w-14 rounded-full border-2 border-[#111] bg-[var(--color-stamp)] text-lg text-[var(--color-paper)] shadow-[0_4px_0_#111] active:translate-y-1 active:shadow-[0_0_0_#111] sm:h-14 sm:w-20 sm:text-xl",
        icon: "h-8 w-8 text-[var(--color-muted)] hover:text-[var(--color-accent)]",
        modal: "h-10 w-10 text-2xl leading-none text-[var(--color-ink)] hover:text-white",
        modalAction: "mt-4 w-full border-2 border-[var(--color-divider)] bg-[var(--color-canvas)] py-2 text-sm tracking-widest text-[var(--color-ink)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]",
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