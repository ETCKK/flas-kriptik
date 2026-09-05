import Puzzle from "@/types/puzzle";

export default function Clue({ puzzle }: { puzzle: Puzzle }) {
    return (
        <section className="pb-10 text-center">
            <p className="mb-0 text-xs md:text-sm font-bold uppercase tracking-[0.18em] text-accent">
                {puzzle.date}
            </p>
            <h1 className="m-0 text-2xl font-black leading-tight text-ink sm:text-4xl">
                {puzzle.clue}
            </h1>
        </section>
    );
}