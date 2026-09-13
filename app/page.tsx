import Link from "next/link";
import Envelope from "@/components/cryptic/Envelope";
import { getCrypticByDate } from "@/lib/cryptic";
import { notFound } from "next/navigation";

export default async function Home() {

    const cryptic = await getCrypticByDate("GG-AA-YYYY");

    if (!cryptic) {
        notFound();
    }

    return (
        <main className="w-full bg-canvas">
            <section className="relative min-h-[500px] w-full px-2 sm:px-6 mt-2 sm:mt-4">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 items-center">

                    <div className="w-[98%] px-2 pt-4 sm:pt-6 tracking-widest">
                        <p className="font-typewriter text-2xl font-bold text-accent sm:text-2xl">
                            Merhaba Ajan,
                        </p>
                        <p className="mt-4 font-typewriter font-thin text-base text-ink sm:text-lg">
                            Günün dosyası hazır. Lütfen zarfı açıp dosyayı incele.
                        </p>
                    </div>

                    <div className="relative items-center justify-center h-[300px] w-full sm:h-[450px] perspective-[1200px]">
                        <Envelope phase="idle" date={cryptic.date} author={cryptic.author} />

                        <Link
                            href="/kriptik/bugun"
                            className="absolute inset-0 z-40 h-[250px] w-[98%] cursor-pointer sm:h-[400px]"
                            aria-label="Bugünün kriptiğini çöz"
                        />
                    </div>

                </div>
            </section>
        </main>
    );
}