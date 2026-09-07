import type { Clue as ClueData } from "@/types";

export default function Clue({ clue }: { clue: ClueData }) {
    return (
        <section className="pb-10 text-center">
            <p className="mb-0 text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-accent">
                {clue.date}
            </p>
            <h1 className="m-0 text-2xl font-black leading-tight text-ink sm:text-4xl">
                {clue.clue}
            </h1>
        </section>
    );
}