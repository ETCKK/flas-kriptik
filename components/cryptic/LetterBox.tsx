export default function LetterBox({
    letter,
    index,
    active,
    onClick,
    isLast,
}: {
    letter: string;
    index: number;
    active: boolean;
    onClick: () => void;
    isLast: boolean;
}) {
    return (
        <button
            type="button"
            aria-label={`${index + 1}. harf${letter ? `: ${letter}` : ""}`}
            onClick={onClick}
            className={`flex aspect-square w-12 shrink cursor-pointer items-center justify-center text-2xl font-extrabold text-ink uppercase transition-all duration-100 sm:w-16 sm:text-4xl ${isLast ? "" : "border-r-2 border-divider/40"
                } ${active
                    ? "bg-canvas/50 shadow-[inset_0_-2px_0_var(--color-accent)] sm:shadow-[inset_0_-4px_0_var(--color-accent)]"
                    : "bg-transparent hover:bg-canvas/20"
                }`}
        >
            {letter}
        </button>
    );
}