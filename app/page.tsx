import Link from "next/link";
import Envelope from "@/components/cryptic/Envelope";

export default function Home() {
    return (
        <main className="w-full bg-canvas">
            <section className="relative min-h-[500px] w-full px-2 sm:px-6 mt-2 sm:mt-4">
                <div className="mx-auto flex w-full max-w-2xl flex-col items-center">

                    <div className="w-[98%] px-2 pt-4 sm:pt-6 tracking-widest">
                        <p className="font-typewriter text-center text-2xl font-bold text-accent sm:text-2xl">
                            Merhaba Ajan
                        </p>
                        <p className="mt-4 font-typewriter font-thin text-base text-ink sm:text-lg">
                            Bugünün dosyası hazır. Lütfen zarfı açıp dosyayı incele.
                        </p>
                    </div>

                    <div className="relative h-[350px] w-full sm:h-[450px] perspective-[1200px]">
                        <Envelope phase="idle" date="GG.AA.YYYY" />

                        <Link
                            href="/kriptik/bugun"
                            className="absolute inset-0 z-40 m-auto h-[300px] w-[98%] cursor-pointer sm:h-[400px]"
                            aria-label="Bugünün kriptiğini çöz"
                        />
                    </div>

                </div>
            </section>
        </main>
    );
}