import LetterBox from "./LetterBox";

interface AnswerGridProps {
    letters: string[];
    cursorIndex: number;
    onSelect: (index: number) => void;
    hasError: boolean;
}

export default function AnswerGrid({ letters, cursorIndex, onSelect, hasError }: AnswerGridProps) {
    return (
        <div className="mx-auto flex w-full justify-center">
            <div className={`flex max-w-full overflow-hidden rounded-sm border-2 ${hasError ? "border-stamp animate-[answerShake_0.35s_ease-in-out]" : "border-paper-ink"} shadow-[2px_2px_0_var(--color-paper-ink)]`}>
                {letters.map((letter, index) => (
                    <LetterBox key={index} letter={letter} index={index} active={index === cursorIndex} onClick={() => onSelect(index)} isLast={index === letters.length - 1} hasError={hasError} />
                ))}
            </div>
        </div>
    );
}