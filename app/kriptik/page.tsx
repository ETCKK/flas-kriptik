import Clue from "@/components/cryptic/Clue";
import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getPublicCrypticById } from "@/lib/cryptic";
import { notFound } from "next/navigation";

export default async function CluePage() {

    const cryptic = await getPublicCrypticById("001");

    if (!cryptic) {
        notFound();
    }

    return (
        <main className="min-h-[calc(100vh-6rem)] bg-canvas px-2 pb-52 pt-28 sm:px-6 sm:pb-48 sm:pt-32">
            <div className="mx-auto w-full max-w-2xl">
                <Clue cryptic={cryptic} />
                <section className="mx-auto w-full py-10 sm:py-14">
                    <CrypticBoard cryptic={cryptic} />
                </section>
            </div>
        </main>
    );
}