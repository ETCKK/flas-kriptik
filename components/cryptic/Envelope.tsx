"use client";

export default function Envelope({ phase, onBreakSeal }: { phase: "idle" | "unsealing" | "extracting" | "playing"; onBreakSeal: () => void }) {
    if (phase === "playing") return null;

    const isFlapOpen = phase === "unsealing" || phase === "extracting";
    const dropClass = phase === "extracting" ? "translate-y-[100vh] opacity-0" : "";

    return (
        <>
            <div className={`absolute inset-y-0 left-1/2 z-0 w-[95%] -translate-x-1/2 rounded-sm bg-envelope-back shadow-xl transition-all duration-1000 ease-in-out ${dropClass}`} />

            <div className={`absolute inset-y-0 left-1/2 z-20 w-[95%] -translate-x-1/2 pointer-events-none transition-all duration-1000 ease-in-out ${dropClass}`}>
                <div className="absolute bottom-0 left-0 right-0 h-[80%] rounded-b-sm border-t-2 border-envelope-back bg-envelope-front shadow-xl pointer-events-auto" />
            </div>

            <div className={`absolute inset-y-0 left-1/2 w-[95%] -translate-x-1/2 pointer-events-none transition-all duration-500 ease-in-out ${isFlapOpen ? "z-0" : "z-30"} ${dropClass}`}>
                <div className={`absolute left-0 right-0 top-0 h-[40%] origin-top rounded-b-xl border-b-2 border-envelope-back bg-envelope-flap shadow-lg transition-transform duration-500 ease-in-out pointer-events-auto ${isFlapOpen ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"}`}>
                    
                    <div className="absolute inset-x-0 bottom-12 flex justify-center">
                        <span className="rounded-sm border-[4px] border-stamp px-6 py-2 font-typewriter text-3xl font-black tracking-widest text-stamp rotate-[-6deg] sm:text-5xl">
                            ÇOK GİZLİ
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={onBreakSeal}
                        disabled={phase !== "idle"}
                        className={`absolute -bottom-10 left-1/2 flex h-20 w-20 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a0c0c] bg-stamp shadow-[inset_0_0_12px_rgba(0,0,0,0.6),0_6px_10px_rgba(0,0,0,0.5)] transition-all duration-300 ${phase === "idle" ? "hover:scale-110" : "scale-50 opacity-0"}`}
                    >
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#5a0c0c]/60 shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                            <span className="font-serif text-3xl font-black text-[#e8d5c4] drop-shadow-md">F</span>
                        </div>
                    </button>
                </div>
            </div>
        </>
    );
}