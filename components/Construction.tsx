export default function Construction({
    description
}: {
    description: string;
}) {
    return (
        <main className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center bg-canvas px-6 text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-muted">
                {description}
            </p>
            <h1 className="text-xl font-extrabold tracking-tight text-accent sm:text-5xl">
                Yapım aşamasında.
            </h1>
        </main>
    );
}