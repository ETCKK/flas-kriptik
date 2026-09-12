"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "./navigationItems";

export default function MobileNavigationMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isOpen]);

    return (
        <div ref={menuRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex cursor-pointer items-center text-sm font-bold tracking-widest text-accent transition-colors hover:text-white"
                aria-label="Menüyü aç/kapat"
                aria-expanded={isOpen}
            >
                [ ≡ ]
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="absolute left-0 top-10 z-50 w-48 rounded-sm border-2 border-divider bg-surface p-2 shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-in slide-in-from-top-2 fade-in duration-100">
                        {navigationItems.map(({ href, label }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex cursor-pointer items-center rounded-sm px-3 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors ${isActive
                                            ? "bg-canvas text-accent"
                                            : "text-ink hover:bg-divider hover:text-white"
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