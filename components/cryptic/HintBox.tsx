import type { Hint } from "@/types";

export default function HintBox({ hint, index }: { hint: Hint; index: number; }) {
    return (
        <article className="animate-in fade-in zoom-in-95 duration-300 rounded-sm border-2 border-divider bg-canvas p-3 shadow-[4px_4px_0_var(--color-divider)]">
            <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-accent sm:text-xs">
                <span>EK NO. 0{index + 1}</span>
                <span>[ {hint.type} ]</span>
            </div>
            <p className="text-sm font-bold leading-relaxed text-ink sm:text-base">
                {hint.text}
            </p>
        </article>
    );
}