"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/hooks/useMounted";
import GearIcon from "@/components/icons/GearIcon";
import Button from "@/components/ui/Button";

export default function SettingsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const mounted = useMounted();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        if (isOpen) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    return (
        <>
            <Button
                type="button"
                aria-label="Sistem ayarları"
                onClick={() => setIsOpen(true)}
                variant="icon"
            >
                <span className="h-5 w-5">
                    <GearIcon />
                </span>
            </Button>
            
            {mounted && createPortal(
                <div aria-hidden={!isOpen} className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${isOpen ? "" : "pointer-events-none"}`}>
                    
                    <div 
                        className={`absolute inset-0 transition-opacity duration-200 ${isOpen ? "bg-[#050505]/80 backdrop-blur-sm opacity-100" : "opacity-0"}`} 
                        onClick={() => setIsOpen(false)} 
                    />
                    
                    <div className={`relative w-full max-w-sm rounded-sm border-2 border-[var(--color-divider)] bg-[var(--color-surface)]/95 p-6 font-typewriter text-[var(--color-ink)] shadow-[0_6px_0_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-200 ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}>
                        
                        <div className="flex items-start justify-between border-b-2 border-[var(--color-divider)] pb-4">
                            <h2 className="text-xl font-black tracking-widest text-[var(--color-accent)]">
                                AYARLAR
                            </h2>
                            <Button
                                type="button" 
                                variant="modal"
                                onClick={() => setIsOpen(false)} 
                            >
                                &times;
                            </Button>
                        </div>
                        
                        <div className="mt-6 flex flex-col gap-4">
                            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                                Yapım aşamasında.
                            </p>
                            
                            <Button
                                type="button" 
                                variant="modalAction"
                                onClick={() => setIsOpen(false)} 
                            >
                                KAPAT
                            </Button>
                        </div>

                    </div>
                </div>,
                document.body
            )}
        </>
    );
}