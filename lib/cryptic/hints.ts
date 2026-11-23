import type { Cryptic, Hint, HintType } from "@/types";

export const HINT_LABELS: Record<HintType, string> = {
    definition: "tanım",
    indicators: "yönerge",
    fodder: "malzeme",
};

export const HINT_DECORATIONS: Record<HintType, string> = {
    definition: "decoration-solid",
    indicators: "decoration-wavy",
    fodder: "decoration-dashed",
};

export function getHints({ definition, indicators, fodder }: Pick<Cryptic, "definition" | "indicators" | "fodder">): Hint[] {
    const hints: Hint[] = [{ type: "definition", text: definition.hint, targets: [definition.target] }];

    if (indicators) {
        hints.push({ type: "indicators", text: indicators.hint, targets: indicators.targets });
    }
    if (fodder) {
        hints.push({ type: "fodder", text: fodder.hint, targets: fodder.targets });
    }

    return hints;
}
