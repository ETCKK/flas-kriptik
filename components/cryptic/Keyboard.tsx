const keyboardRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Ğ", "Ü"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ş", "İ"],
    ["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç"],
];

export default function Keyboard({
    onKey,
    onBackspace,
}: {
    onKey: (key: string) => void;
    onBackspace: () => void;
}) {
    return (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-divider bg-canvas px-3 py-3 sm:px-6 sm:py-4" aria-label="Ekran klavyesi">
            <div className="mx-auto max-w-2xl space-y-2.5">
                {keyboardRows.map((row) => (
                    <div key={row[0]} className="flex justify-center gap-1.5 sm:gap-2">
                        {row.map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => onKey(key)}
                                className="h-11 min-w-0 flex-1 rounded-sm border-b-4 border-divider bg-surface px-0.5 text-sm font-bold text-ink transition-all duration-50 active:translate-y-1 active:border-b-0 sm:h-12 sm:px-1 sm:text-base sm:max-w-12"
                            >
                                {key}
                            </button>
                        ))}
                        {row === keyboardRows[2] && (
                            <button
                                type="button"
                                aria-label="Son harfi sil"
                                onClick={onBackspace}
                                className="h-11 min-w-12 rounded-sm border-b-4 border-shadow bg-danger px-1 text-base font-black text-ink transition-all duration-50 active:translate-y-1 active:border-b-0 sm:h-12 sm:min-w-16 sm:px-2 sm:text-lg"
                            >
                                ⌫
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}