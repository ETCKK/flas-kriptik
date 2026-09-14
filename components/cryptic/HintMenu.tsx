import { useState, useEffect } from "react";
import type { Cryptic } from "@/types";

interface HintMenuProps {
    cryptic: Cryptic;
    isOpen: boolean;
    onClose: () => void;
    onUnlockHint: (hintIndex: number) => void;
}

export default function HintMenu({ cryptic, isOpen, onClose, onUnlockHint }: HintMenuProps) {
    const [view, setView] = useState<"menu" | "hint">("menu");
    const [activeHintIdx, setActiveHintIdx] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen) {
            setView("menu");
            setActiveHintIdx(null);
        } else {
            const timer = setTimeout(() => {
                setView("menu");
                setActiveHintIdx(null);
            }, 250); 
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const getDecorationClass = (type: string) => {
        const normalizedType = type.toLocaleLowerCase("tr-TR").trim();
        switch (normalizedType) {
            case "yönerge":
                return "pen-underline decoration-wavy";
            case "malzeme":
                return "pen-underline decoration-dashed";
            case "tanım":
            default:
                return "pen-underline decoration-solid";
        }
    };

    const handleSelectHint = (idx: number) => {
        onUnlockHint(idx);
        setActiveHintIdx(idx);
        setView("hint"); 
    };

    const overlayClass = isOpen 
        ? "opacity-100 pointer-events-auto" 
        : "opacity-0 pointer-events-none";

    return (
        <div className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-250 ${overlayClass}`}>
            <div className="absolute inset-0" onClick={onClose} />

            <div className="pointer-events-none relative flex w-full justify-center px-4">
                <div 
                    className={`pointer-events-auto absolute bottom-0 z-10 w-[94%] max-w-xs sm:max-w-lg transition-transform duration-250 ease-in-out ${
                        isOpen && view === "menu" ? "translate-y-0" : "translate-y-[120%]"
                    }`}
                >
                    <div className={`dot-matrix-paper w-full px-8 py-6 text-paper-ink shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_-15px_30px_rgba(0,0,0,0.6)] ${
                        isOpen && view === "menu" ? "animate-fax" : ""
                    }`}>
                        <div className="mb-6 flex h-6 items-center justify-center">
                            <span className="font-typewriter text-sm sm:text-base font-bold tracking-[0.2em] text-paper-ink/50">
                                İstihbarat Al
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-6 font-typewriter">
                            {cryptic.hints.map((hint, idx) => (
                                <button 
                                    key={idx} 
                                    onClick={() => handleSelectHint(idx)}
                                    className="group flex h-6 flex-col items-center justify-center cursor-pointer transition-opacity hover:opacity-60"
                                >
                                    <span className={`text-base sm:text-xl leading-[24px] font-bold uppercase tracking-widest ${getDecorationClass(hint.type)}`}>
                                        {hint.type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div 
                    className={`pointer-events-auto absolute bottom-0 z-20 w-[94%] max-w-sm sm:max-w-lg transition-transform duration-250 ease-in-out ${
                        isOpen && view === "hint" ? "translate-y-0" : "translate-y-[120%]"
                    }`}
                >
                    <div className={`dot-matrix-paper w-full px-8 pt-6 pb-6 text-paper-ink shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_-15px_30px_rgba(0,0,0,0.6)] ${
                        isOpen && view === "hint" ? "animate-fax" : ""
                    }`}>
                        {activeHintIdx !== null && (
                            <div className="flex min-h-[72px] flex-col justify-center">
                                <p className="text-left font-typewriter text-md sm:text-lg font-medium leading-[24px] text-paper-ink">
                                    {cryptic.hints[activeHintIdx].text}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}