type HintType = "Yönerge" | "Tanım" | "Malzeme";

interface Hint {
    text: string;
    type: HintType;
}

export type { Hint, HintType };