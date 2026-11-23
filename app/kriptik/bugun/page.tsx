import { redirect } from "next/navigation";
import { connection } from "next/server";
import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getPublishedByDate } from "@/lib/cryptic";
import { todayIstanbul } from "@/lib/date";

export default async function TodaysCrypticPage() {
    await connection();

    const cryptic = await getPublishedByDate(todayIstanbul());

    if (!cryptic) {
        redirect("/");
    }

    return (
        <main className="h-[calc(100dvh-5rem)] w-full overflow-hidden bg-canvas px-2 sm:px-6">
            <div className="mx-auto h-full w-full max-w-2xl">
                <section className="h-full w-full">
                    <CrypticBoard key={cryptic.id} cryptic={cryptic} isDaily />
                </section>
            </div>
        </main>
    );
}