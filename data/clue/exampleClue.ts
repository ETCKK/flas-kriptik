import type { Clue } from "@/types";

export const clue: Clue = {
    id: "001",
    date: "GG.AA.YYYY",
    clue: "Örnek bir kriptik metni.",
    length: 5,
    difficulty: "Kolay",
    author: "Örnek Yazar",
    answer: "cevap",
    hints: [
        {
            text: "Örnek tanım ipucu metni.",
            type: "Tanım",
        },
        {
            text: "Örnek yönerge ipucu metni.",
            type: "Yönerge",
        },
        {
            text: "Örnek malzeme ipucu metni.",
            type: "Malzeme",
        }
    ],
    explanation: "Örnek kriptik cevap açıklaması.",
    definition: "Örnek kriptik tanımı.",
    indicators: ["yönerge 1", "yönerge 2"],
    fodders: ["malzeme 1", "malzeme 2"],
};

