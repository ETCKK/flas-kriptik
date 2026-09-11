import LetterBox from "./LetterBox";

export default function AnswerGrid({ letters, cursorIndex, onSelect }: { letters: string[]; cursorIndex: number; onSelect: (index: number) => void; }) {
    return (
        <div className="mx-auto flex w-full justify-center">
            <div className="flex max-w-full overflow-hidden rounded-sm border-2 border-paper-ink shadow-[2px_2px_0_var(--color-paper-ink)]">
                {letters.map((letter, index) => (
                    <LetterBox key={index} letter={letter} index={index} active={index === cursorIndex} onClick={() => onSelect(index)} isLast={index === letters.length - 1} />
                ))}
            </div>
        </div>
    );
}