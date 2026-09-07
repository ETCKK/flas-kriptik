import Clue from "@/components/clue/Clue";
import ClueBoard from "@/components/clue/ClueBoard";
import { getTodaysClue } from "@/data/clue/repository";

export default async function CluePage() {
    const clue = await getTodaysClue();

    return (
        <main className="min-h-[calc(100vh-6rem)] bg-canvas px-2 pb-52 pt-28 sm:px-6 sm:pb-48 sm:pt-32">
            <div className="mx-auto w-full max-w-3xl">
                <Clue clue={clue} />
                <section className="mx-auto w-full py-10 sm:py-14">
                    <ClueBoard clue={clue} />
                </section>
            </div>
        </main>
    );
}