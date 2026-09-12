"use client";

import type { Cryptic } from "@/types";
import Button from "@/components/ui/Button";
import type { CrypticPhase } from "../hooks/useCrypticPhase";
import AnswerGrid from "../AnswerGrid";

interface CluePageProps {
	cryptic: Cryptic;
	phase: CrypticPhase;
	letters: string[];
	cursorIndex: number;
	setCursorIndex: (i: number) => void;
	canSubmit: boolean;
	isWon: boolean;
	hasAnswerError: boolean;
	handleSubmit: () => void;
}

export default function CluePage({
	cryptic, phase, letters, cursorIndex, setCursorIndex, canSubmit, isWon, hasAnswerError, handleSubmit,
}: CluePageProps) {
	return (
		<div className="font-typewriter relative">
			{isWon && (
				<div className="absolute inset-0 z-20 flex pointer-events-none items-center justify-center">
					<div className="animate-[stampHit_0.4s_ease-out_forwards] rounded-sm border-[6px] border-stamp px-8 py-3 text-5xl sm:text-7xl font-black tracking-widest text-stamp rotate-[-15deg] bg-paper/10">
						ÇÖZÜLDÜ
					</div>
				</div>
			)}

			<div className="mb-6 flex flex-row justify-between border-b-2 border-paper-ink pb-3 text-[10px] font-bold sm:text-sm">
				<div className="flex flex-col text-left">
					<span>GÖNDEREN: <span className="uppercase">{cryptic.author || "MERKEZ"}</span></span>
				</div>
				<div className="flex flex-col text-right">
					<span>TARİH: {cryptic.date.replace(/-/g, ".")}</span>
				</div>
			</div>

			<div className="mb-10 text-sm leading-relaxed opacity-90 sm:text-base">
				<p className="mt-2">
					Teşkilattan yeni bir görev aldın. Aşağıdaki kriptik metni çözerek şifreyi bulmalı ve merkeze iletmelisin.
				</p>
			</div>

			<h1 className="mb-12 text-center text-2xl font-black leading-relaxed tracking-wide sm:text-3xl">
				&quot;{cryptic.clue}&quot;
			</h1>

			<div className="mb-12 relative z-30">
				<AnswerGrid letters={letters} cursorIndex={isWon ? -1 : cursorIndex} onSelect={setCursorIndex} hasError={hasAnswerError} />
			</div>

			{(phase === "playing" || phase === "extracting") && (
				<div className={`flex justify-center gap-3 sm:gap-4 relative z-30 transition-opacity duration-500 ${isWon ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
					<Button type="button" variant="paperSecondary" disabled>
						İstihbarat Al
					</Button>
					<Button
						type="button"
						variant="paper"
						onClick={handleSubmit}
						disabled={!canSubmit || hasAnswerError}
					>
						Deşifre Et
					</Button>
				</div>
			)}
		</div>
	);
}
