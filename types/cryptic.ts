type CrypticDifficulty = "Kolay" | "Orta" | "Zor";

interface CrypticDefinition {
    target: string;
    hint: string;
}

interface CrypticWordGroup {
    targets: string[];
    hint: string;
}

interface Cryptic {
    id: string;
    number: number;
    publishDate: string | null;
    clue: string;
    length: number;
    author: string;
    difficulty?: CrypticDifficulty;
    answer: string;
    definition: CrypticDefinition;
    indicators?: CrypticWordGroup;
    fodder?: CrypticWordGroup;
    explanation?: string;
}

type PublishedCryptic = Cryptic & { publishDate: string };

export type { Cryptic, CrypticDefinition, CrypticDifficulty, CrypticWordGroup, PublishedCryptic };
