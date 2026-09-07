import LetterBox from "./LetterBox";

export default function AnswerGrid({
    letters,
    activeIndex,
    onSelect,
}: {
    letters: string[];
    activeIndex: number;
    onSelect: (index: number) => void;
}) {
    return (
        <div className="mx-auto flex w-full justify-center px-1 sm:px-2" aria-label="Cevap harfleri">
            <div className="flex max-w-full overflow-hidden rounded-sm border-2 border-divider bg-surface shadow-sm">
                {letters.map((letter, index) => (
                    <LetterBox
                        key={index}
                        letter={letter}
                        index={index}
                        active={index === activeIndex}
                        onClick={() => onSelect(index)}
                        isLast={index === letters.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}