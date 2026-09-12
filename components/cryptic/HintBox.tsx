import type { Hint } from "@/types";

interface HintBoxProps {
	hint: Hint;
}

export default function HintBox({ hint }: HintBoxProps) {
	return (
		<article className="border-2 border-paper-ink bg-paper/60 p-4 shadow-[3px_3px_0_var(--color-paper-ink)] transition-all duration-300">
			<div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-widest sm:text-xs">
				<span>{hint.type}</span>
			</div>
			<p className="text-sm leading-relaxed">{hint.text}</p>
		</article>
	);
}