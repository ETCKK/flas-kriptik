import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getCrypticById } from "@/lib/cryptic";
import { notFound } from "next/navigation";

export default async function TodaysCrypticPage() {

    const cryptic = await getCrypticById("e-001");

    if (!cryptic) {
        notFound();
    }

    return (
        <main className="h-[calc(100dvh-5rem)] w-full overflow-hidden bg-canvas px-2 sm:px-6">
            <div className="mx-auto h-full w-full max-w-2xl">
                <section className="h-full w-full">
                    <CrypticBoard key={cryptic.id} cryptic={cryptic} />
                </section>
            </div>
        </main>
    );
}