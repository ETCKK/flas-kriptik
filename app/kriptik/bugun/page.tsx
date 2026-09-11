import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getPublicCrypticById } from "@/lib/cryptic";
import { notFound } from "next/navigation";

export default async function TodaysCrypticPage() {

    const cryptic = await getPublicCrypticById("001");

    if (!cryptic) {
        notFound();
    }

    return (
        <main className="min-h-[calc(100vh-6rem)] overflow-x-clip bg-canvas px-2 pb-8 pt-4 sm:px-6 sm:pt-6">
            <div className="mx-auto w-full max-w-2xl">
                <section className="mx-auto w-full py-2 sm:py-3">
                    <CrypticBoard cryptic={cryptic} />
                </section>
            </div>
        </main>
    );
}