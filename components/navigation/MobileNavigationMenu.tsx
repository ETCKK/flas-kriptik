"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./navigationItems";

export default function MobileNavigationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center text-sm font-bold tracking-widest text-[var(--color-accent)] transition-colors hover:text-white"
                aria-label="Menüyü aç/kapat"
            >
                [ ≡ ]
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute left-0 top-10 z-50 w-48 rounded-sm border-2 border-[var(--color-divider)] bg-[var(--color-surface)] p-2 shadow-[4px_4px_0_rgba(0,0,0,0.5)] animate-in slide-in-from-top-2 fade-in duration-100">
                        {navigationItems.map(({ href, label }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex cursor-pointer items-center rounded-sm px-3 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${isActive
                                            ? "bg-[var(--color-canvas)] text-[var(--color-accent)]"
                                            : "text-[var(--color-ink)] hover:bg-[var(--color-divider)] hover:text-white"
                                        }`}
                                >
                                    <span aria-hidden="true" className={`mr-1 inline-block w-[0.7em] ${isActive ? "opacity-100" : "opacity-0"}`}>
                                        &gt;
                                    </span>
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}