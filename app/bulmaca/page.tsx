import Clue from "@/components/puzzle/Clue";
import PuzzleBoard from "@/components/puzzle/PuzzleBoard";
import { getTodaysPuzzle } from "@/data/puzzle/repository";

export default async function PuzzlePage() {
    const puzzle = await getTodaysPuzzle();

    return (
        <main className="min-h-[calc(100vh-6rem)] bg-canvas px-2 pb-52 pt-28 sm:px-6 sm:pb-48 sm:pt-32">
            <div className="mx-auto w-full max-w-3xl">
                <Clue puzzle={puzzle} />
                <section className="mx-auto w-full py-10 sm:py-14">
                    <PuzzleBoard puzzle={puzzle} />
                </section>
            </div>
        </main>
    );
}