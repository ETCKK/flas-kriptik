import { notFound } from "next/navigation";
import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getPublishedByDate, getPublishedByNumber } from "@/lib/cryptic";
import { parseSlug } from "@/lib/cryptic/slug";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DailyCrypticPage({ params }: Props) {
    const { slug } = await params;

    const parsed = parseSlug(slug);

    if (!parsed) {
        notFound();
    }

    const cryptic = parsed.kind === "date"
        ? await getPublishedByDate(parsed.date)
        : await getPublishedByNumber(parsed.number);

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