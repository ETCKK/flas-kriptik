type HintType = "definition" | "indicators" | "fodder";

interface Hint {
    type: HintType;
    text: string;
    targets: string[];
}

export type { Hint, HintType };
