import Button from "@/components/ui/Button";

const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"]
];

export default function Keyboard({ onKey, onBackspace }: { onKey: (key: string) => void; onBackspace: () => void; }) {
    return (
        <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 animate-[slideUpTw_0.5s_ease-out_forwards] border-t-4 border-[#111] bg-tw-bg shadow-[0_-10px_40px_rgba(0,0,0,0.8)] pb-safe sm:rounded-t-xl sm:border-x-4">
            <div className="mx-auto flex w-full flex-col items-center space-y-2 px-1 py-3 sm:space-y-4 sm:px-6 sm:py-5">
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