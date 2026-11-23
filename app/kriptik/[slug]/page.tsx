import { notFound } from "next/navigation";
import { connection } from "next/server";
import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getPublishedByDate, getPublishedByNumber } from "@/lib/cryptic";
import { parseSlug } from "@/lib/cryptic/slug";
import { todayIstanbul } from "@/lib/date";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DailyCrypticPage({ params }: Props) {
    const { slug } = await params;
    await connection();

    const parsed = parseSlug(slug);

    if (!parsed) {
        notFound();
    }

    const today = todayIstanbul();
    const cryptic = parsed.kind === "date"
        ? await getPublishedByDate(parsed.date, today)
        : await getPublishedByNumber(parsed.number, today);

    if (!cryptic) {
        notFound();
    }

    return (
        <main className="h-[calc(100dvh-5rem)] w-full overflow-hidden bg-canvas px-2 sm:px-6">
            <div className="mx-auto h-full w-full max-w-2xl">
            <section className="h-full w-full">
                    <CrypticBoard key={cryptic.id} cryptic={cryptic} isDaily={cryptic.publishDate === today} />
                </section>
            </div>
        </main>
    );
}