import CrypticBoard from "@/components/cryptic/CrypticBoard";
import { getCrypticById, getCrypticByDate } from "@/lib/cryptic";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export default async function DailyCrypticPage({ params }: Props) {
    const { slug } = await params;

    const isDate = /^\d{2}-\d{2}-\d{4}$/.test(slug);

    const cryptic = isDate
        ? await getCrypticByDate(slug)
        : await getCrypticById(slug);

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