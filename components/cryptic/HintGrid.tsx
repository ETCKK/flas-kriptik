import type { Hint } from "@/types";
import HintBox from "./HintBox";

interface HintGridProps {
	hints: Hint[];
	unlockedHints: number[];
}

export default function HintGrid({ hints, unlockedHints }: HintGridProps) {
	if (hints.length === 0) return null;

	return (
		<section className="mb-10" aria-label="İpuçları transition-all duration-300">
			<div className="mb-3 flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
				<span>İstihbarat</span>
				<span className="h-px flex-1 bg-paper-ink/30" />
			</div>
			<div className="grid gap-4">
				{hints.map((hint, index) => (
					unlockedHints.includes(index) ? <HintBox key={`${hint.type}-${index}`} hint={hint} /> : null
				))}
			</div>
		</section>
	);
}