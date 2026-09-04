import Puzzle from "@/types/puzzle";

export default function Clue({ puzzle }: { puzzle: Puzzle }) {
    return (
        <section className="pb-8 text-center">
            <h1 className="m-0 text-2xl font-black leading-tight text-ink sm:text-4xl">
                {puzzle.clue}
            </h1>
            {puzzle.difficulty && (
                <p className="mt-4 text-sm font-bold text-accent">
                    {puzzle.date}
                </p>
            )}
        </section>
    );
}