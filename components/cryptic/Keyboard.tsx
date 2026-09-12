import Button from "@/components/ui/Button";

const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"]
];

export default function Keyboard({ onKey, onBackspace, isVisible }: { onKey: (key: string) => void; onBackspace: () => void; isVisible: boolean }) {
    return (
        <div
            className={`mx-auto w-full max-w-2xl border-t-4 border-[#111] bg-tw-bg shadow-none sm:rounded-t-xl sm:border-x-4 sm:shadow-[0_-10px_40px_rgba(0,0,0,0.8)] transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isVisible
                    ? "translate-y-0 opacity-100 pointer-events-auto"
                    : "translate-y-full opacity-0 pointer-events-none"
            }`}
        >
            <div className="mx-auto flex w-full flex-col items-center space-y-2 px-1 py-2 sm:space-y-3 sm:px-4 sm:py-3">
                {keyboardRows.map((row, rowIndex) => (
                    <div key={row[0]} className="flex w-full justify-center gap-1 sm:gap-2.5">
                        {row.map((key) => (
                            <Button
                                key={key}
                                type="button"
                                variant="keyboard"
                                onClick={() => onKey(key)}
                            >
                                {key}
                            </Button>
                        ))}
                        {rowIndex === 2 && (
                            <Button
                                type="button"
                                aria-label="Sil"
                                variant="delete"
                                onClick={onBackspace}
                            >
                                ⌫
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}