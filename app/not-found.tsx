import Link from "next/link";

export default function NotFound() {
    return (
        <main className="flex min-h-[calc(100vh-6rem)] items-center justify-center bg-canvas px-6 py-16">
            <section className="w-full max-w-xl text-center">
                <h1 className="mb-4 text-6xl font-bold uppercase tracking-[0.2em] text-accent">
                    404
                </h1>
                <h1 className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                    Sayfa bulunamadı
                </h1>
                <Link
                    href="/"
                    className="mt-8 inline-flex rounded-sm bg-accent px-5 py-3 text-sm font-bold text-surface"
                >
                    Ana sayfaya dön
                </Link>
            </section>
        </main>
    );
}
