export default function LetterBox({
    letter, index, active, onClick, isLast,
}: {
    letter: string; index: number; active: boolean; onClick: () => void; isLast: boolean;
}) {
    return (
        <button
            type="button"
            aria-label={`${index + 1}. harf`}
            onClick={onClick}
            className={`flex aspect-square w-10 shrink cursor-pointer items-center justify-center font-typewriter text-2xl font-bold text-paper-ink uppercase transition-all duration-100 sm:w-14 sm:text-3xl ${
                isLast ? "" : "border-r-2 border-paper-ink/40"
            } ${
                active
                    ? "bg-paper-ink/10 shadow-[inset_0_-4px_0_var(--color-paper-ink)]"
                    : "bg-transparent hover:bg-paper-ink/5"
            }`}
        >
            {letter}
        </button>
    );
}