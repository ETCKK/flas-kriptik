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
                className="group flex h-10 w-10 touch-manipulation items-center justify-center text-[#f2a65a] transition-colors duration-200 hover:bg-[#f2a65a] hover:text-[#29324d]"
            >
                <span className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-45' : 'group-hover:rotate-45'}`}>
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
                        className={`absolute inset-0 transition-all duration-200 ${
                            isOpen
                                ? "bg-[#101722]/70 opacity-100 backdrop-blur-sm"
                                : "bg-[#101722]/0 opacity-0 backdrop-blur-0"
                        }`}
                        onClick={() => setIsOpen(false)}
                    />
                    
                    <div
                        className={`relative w-full max-w-sm origin-top border-2 border-[#f2a65a] bg-[#29324d] p-6 text-[#fffaf5] shadow-[6px_6px_0_#f2a65a] transition-all duration-200 ease-out ${
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
                                className="flex h-12 w-12 items-center justify-center text-4xl leading-none text-[#f2a65a] hover:text-[#fffaf5]"
                            >
                                &times;
                            </button>
                        </div>
                        <p className="mt-6 border-t border-[#59617d] pt-4 text-sm text-[#c5c9d5]">
                            Yapım aşamasında.
                        </p>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
}