"use client";

export default function Envelope({ phase, date, onBreakSeal }: { phase: "idle" | "unsealing" | "extracting" | "playing"; date: string; onBreakSeal: () => void }) {
    if (phase === "playing") return null;

    const isFlapOpen = phase === "unsealing" || phase === "extracting";
    const dropClass = phase === "extracting" ? "translate-y-[100vh] opacity-0" : "";

    const envelopeBase = "absolute inset-0 m-auto w-[98%] sm:w-[102%] h-[95%] max-h-[640px]";

    return (
        <>
            <div className={`${envelopeBase} absolute inset-y-0 left-1/2 z-0 w-[95%] -translate-x-1/2 rounded-sm bg-envelope-back shadow-xl transition-all duration-1000 ease-in-out ${dropClass}`} />

            <div className={`${envelopeBase} absolute inset-y-0 left-1/2 z-20 w-[95%] -translate-x-1/2 pointer-events-none transition-all duration-1000 ease-in-out ${dropClass}`}>
                <div className="absolute bottom-0 left-0 right-0 h-[80%] rounded-b-sm border-t-2 border-envelope-back bg-envelope-front shadow-xl pointer-events-auto">
                    <span className="absolute bottom-4 right-5 font-typewriter text-md font-bold tracking-wider text-paper-ink/45 sm:bottom-6 sm:right-8 sm:text-xl">
                        {date.replace(/-/g, ".")}
                    </span>
                </div>
            </div>

            <div className={`${envelopeBase} absolute inset-y-0 left-1/2 w-[95%] -translate-x-1/2 pointer-events-none transition-all duration-500 ease-in-out ${isFlapOpen ? "z-0" : "z-30"} ${dropClass}`}>
                <div className={`absolute left-0 right-0 top-0 h-[40%] origin-top rounded-b-xl border-b-2 border-envelope-back bg-envelope-flap shadow-lg transition-transform duration-500 ease-in-out pointer-events-auto ${isFlapOpen ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"}`}>
                    
                    <div className="absolute inset-x-0 bottom-14 sm:bottom-18 flex justify-center">
                        <span className="rounded-sm border-[4px] border-stamp px-6 py-2 font-typewriter text-4xl font-black tracking-widest text-stamp rotate-[-8deg] sm:text-6xl">
                            ÇOK GİZLİ
                        </span>
                    </div>

                    <button
                        type="button"
                        aria-label="Mühürü kır"
                        onClick={onBreakSeal}
                        disabled={phase !== "idle"}
                        className={`absolute -bottom-10 sm:-bottom-12 left-1/2 flex h-18 w-18 sm:h-24 sm:w-24 -translate-x-1/2 cursor-pointer items-center justify-center transition-all duration-300 ${phase === "idle" ? "hover:scale-105" : "scale-50 opacity-0"}`}
                    >
                        <div
                            className="absolute inset-0 bg-[#8b1515] shadow-[0_4px_6px_rgba(0,0,0,0.4)]"
                            style={{ borderRadius: "47% 53% 51% 49% / 50% 48% 52% 50%" }}
                        />
                        <div
                            className="absolute inset-1.5 bg-[#7a1212] shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)]"
                            style={{ borderRadius: "52% 48% 49% 51% / 51% 49% 52% 48%" }}
                        />
                        <div className="relative flex h-full w-full items-center justify-center">
                            <span
                                className="font-serif text-4xl sm:text-5xl font-black text-[#3a0606] opacity-90"
                                style={{
                                    textShadow: "0px 1px 1px rgba(255,255,255,0.15), 0px -1px 1px rgba(0,0,0,0.4)"
                                }}
                            >
                                F
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}