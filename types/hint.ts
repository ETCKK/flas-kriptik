type HintType = "yönerge" | "tanım" | "malzeme";

interface Hint {
    text: string;
    type: HintType;
    targets?: string[];
}

export type { Hint, HintType };