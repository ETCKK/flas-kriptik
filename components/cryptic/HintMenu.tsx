import { useState } from "react";
import type { Cryptic, HintType } from "@/types";
import { HINT_DECORATIONS, HINT_LABELS, getHints } from "@/lib/cryptic/hints";

interface HintMenuProps {
    cryptic: Cryptic;
    isOpen: boolean;
    onClose: () => void;
    onUnlockHint: (type: HintType) => void;
}

export default function HintMenu({ cryptic, isOpen, onClose, onUnlockHint }: HintMenuProps) {
    const [view, setView] = useState<"menu" | "hint">("menu");
    const [activeHintType, setActiveHintType] = useState<HintType | null>(null);
    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

    if (prevIsOpen !== isOpen) {
        setPrevIsOpen(isOpen);
        if (isOpen) {
            setView("menu");
            setActiveHintType(null);
        }
    }

    const isMenuVisible = isOpen && view === "menu";
    const isHintVisible = isOpen && view === "hint";

    const hints = getHints(cryptic);
    const activeHint = hints.find((hint) => hint.type === activeHintType);

    const handleSelectHint = (type: HintType) => {
        onUnlockHint(type);
        setActiveHintType(type);
        setView("hint"); 
    };

    const overlayClass = isOpen 
        ? "opacity-100 pointer-events-auto" 
        : "opacity-0 pointer-events-none";

    return (
        <div inert={!isOpen} className={`fixed inset-0 z-50 flex flex-col justify-end transition-opacity duration-250 ${overlayClass}`}>
            <div className="absolute inset-0" onClick={onClose} />

            <div className="pointer-events-none relative flex w-full justify-center px-4">
                <div
                    inert={!isMenuVisible}
                    className={`pointer-events-auto absolute bottom-0 z-10 w-[94%] max-w-xs sm:max-w-lg transition-transform duration-250 ease-in-out ${
                        isMenuVisible ? "translate-y-0" : "translate-y-[120%]"
                    }`}
                >
                    <div className={`dot-matrix-paper w-full px-8 py-6 text-paper-ink shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_-15px_30px_rgba(0,0,0,0.6)] ${
                        isMenuVisible ? "animate-fax" : ""
                    }`}>
                        <div className="mb-6 flex h-6 items-center justify-center">
                            <span className="font-typewriter text-sm sm:text-base font-bold tracking-[0.2em] text-paper-ink/50">
                                İstihbarat Al
                            </span>
                        </div>
                        
                        <div className="flex flex-col gap-6 font-typewriter">
                            {hints.map((hint) => (
                                <button 
                                    key={hint.type} 
                                    onClick={() => handleSelectHint(hint.type)}
                                    className="group flex h-6 flex-col items-center justify-center cursor-pointer transition-opacity hover:opacity-60"
                                >
                                    <span className={`text-base sm:text-xl leading-[24px] font-bold uppercase tracking-widest pen-underline ${HINT_DECORATIONS[hint.type]}`}>
                                        {HINT_LABELS[hint.type]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    inert={!isHintVisible}
                    className={`pointer-events-auto absolute bottom-0 z-20 w-[94%] max-w-sm sm:max-w-lg transition-transform duration-250 ease-in-out ${
                        isHintVisible ? "translate-y-0" : "translate-y-[120%]"
                    }`}
                >
                    <div className={`dot-matrix-paper w-full px-8 pt-6 pb-6 text-paper-ink shadow-[0_0_0_1px_rgba(0,0,0,0.15),0_-15px_30px_rgba(0,0,0,0.6)] ${
                        isHintVisible ? "animate-fax" : ""
                    }`}>
                        {activeHint && (
                            <div className="flex min-h-[72px] flex-col justify-center">
                                <p className="text-left font-typewriter text-md sm:text-lg font-medium leading-[24px] text-paper-ink">
                                    {activeHint.text}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}