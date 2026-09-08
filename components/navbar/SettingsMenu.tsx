"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import GearIcon from "@/components/icons/GearIcon";

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <>
            <button
                type="button"
                aria-label="Ayarlar"
                onClick={() => setIsOpen(true)}
                className="group flex h-10 w-10 rounded-xs cursor-pointer touch-manipulation items-center justify-center text-accent transition-colors duration-100 hover:bg-accent hover:text-surface"
            >
                <span className={`h-5 w-5 text-ink transition-transform duration-200 ${isOpen ? 'rotate-45' : 'group-hover:rotate-45'}`}>
                    <GearIcon />
                </span>
            </button>
            
            {mounted && createPortal(
                <div
                    aria-hidden={!isOpen}
                    className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${
                        isOpen ? "" : "pointer-events-none"
                    }`}
                >
                    
                    <div 
                        className={`absolute inset-0 transition-all duration-100 ${
                            isOpen
                                ? "bg-canvas/70 opacity-100 backdrop-blur-sm"
                                : "bg-canvas/0 opacity-0 backdrop-blur-0"
                        }`}
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <div
                        className={`relative w-full max-w-sm origin-top rounded-sm border-2 border-accent bg-surface p-6 text-ink shadow-[6px_6px_0_var(--color-accent)] transition-all duration-100 ease-out ${
                            isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                        }`}
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 id="settings-title" className="mt-2 text-2xl font-black">
                                    Ayarlar
                                </h2>
                            </div>
                            <button
                                type="button"
                                aria-label="Ayarları kapat"
                                onClick={() => setIsOpen(false)}
                                className="flex h-12 w-12 items-center justify-center text-4xl leading-none text-accent hover:text-ink"
                            >
                                &times;
                            </button>
                        </div>
                        <p className="mt-6 border-t border-divider pt-4 text-sm text-muted">
                            Yapım aşamasında.
                        </p>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}