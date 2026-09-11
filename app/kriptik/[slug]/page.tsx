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
        <main className="min-h-[calc(100vh-6rem)] overflow-x-clip bg-canvas px-2 pb-8 pt-4 sm:px-6 sm:pt-6">
            <div className="mx-auto w-full max-w-2xl">
                <section className="mx-auto w-full py-2 sm:py-3">
                    <CrypticBoard cryptic={cryptic} />
                </section>
            </div>
        </main>
    );
}