"use client";

export default function Envelope({ phase, date }: { phase: "idle" | "unsealing" | "extracting" | "playing"; date: string; }) {
    if (phase === "playing") return null;

    const isFlapOpen = phase === "unsealing" || phase === "extracting";
    const isMovedDown = phase === "unsealing" || phase === "extracting";
    const positionClass = isMovedDown 
        ? "top-[98%] -translate-y-full scale-100 opacity-100" 
        : "top-1/2 -translate-y-1/2 scale-100 opacity-100";

    const dropClass = phase === "extracting" ? "translate-y-[60vh] scale-95 opacity-0" : "";
    const envelopeSize = "w-[98%] h-[300px] sm:h-[400px]";

    return (
        <div className={`absolute left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${positionClass} ${envelopeSize}`}>
            
            <div className={`absolute inset-0 rounded-sm bg-envelope-back shadow-2xl transition-all duration-700 ${dropClass}`} />

            <div className={`absolute inset-0 z-20 pointer-events-none transition-all duration-700 ${dropClass}`}>
                <div className="absolute bottom-0 left-0 right-0 h-[80%] rounded-b-sm border-t-[1px] border-envelope-back/60 bg-envelope-front shadow-[0_-8px_16px_rgba(0,0,0,0.1)] pointer-events-auto">
                    <span className="absolute bottom-3 right-4 font-typewriter text-xs font-bold tracking-wider text-paper-ink/45 sm:bottom-4 sm:right-6 sm:text-base">
                        {date.replace(/-/g, ".")}
                    </span>
                </div>
            </div>

            <div className={`absolute inset-0 pointer-events-none transition-all duration-700 ${dropClass} ${isFlapOpen ? "z-0" : "z-30"}`}>
                <div className={`absolute left-0 right-0 top-0 h-[45%] origin-top rounded-b-[30px] sm:rounded-b-[40px] border-b-2 border-envelope-back/60 bg-envelope-flap shadow-xl transition-transform duration-600 ease-in-out pointer-events-auto ${isFlapOpen ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"}`}>
                    
                    <div className="absolute inset-x-0 bottom-12 sm:bottom-16 flex justify-center opacity-90">
                        <span className="rounded-sm border-[3px] sm:border-[4px] border-stamp px-4 py-1.5 sm:px-6 sm:py-2 font-typewriter text-2xl sm:text-4xl font-black tracking-widest text-stamp rotate-[-6deg] shadow-sm">
                            ÇOK GİZLİ
                        </span>
                    </div>

                    <div className={`absolute -bottom-8 sm:-bottom-10 left-1/2 flex h-16 w-16 sm:h-20 sm:w-20 -translate-x-1/2 items-center justify-center transition-all duration-400 ${phase === "idle" ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}>
                        <div className="absolute inset-0 bg-[#8b1515] shadow-[0_4px_6px_rgba(0,0,0,0.4)]" style={{ borderRadius: "47% 53% 51% 49% / 50% 48% 52% 50%" }} />
                        <div className="absolute inset-1.5 bg-[#7a1212] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]" style={{ borderRadius: "52% 48% 49% 51% / 51% 49% 52% 48%" }} />
                        <div className="relative flex h-full w-full items-center justify-center">
                            <span className="font-serif text-3xl sm:text-4xl font-black text-[#3a0606] opacity-90" style={{ textShadow: "0px 1px 1px rgba(255,255,255,0.15), 0px -1px 1px rgba(0,0,0,0.4)" }}>
                                F
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}