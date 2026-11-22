import type { Cryptic } from "@/types";

export const cryptic: Cryptic = {
    id: "e-001",
    number: 1,
    publishDate: null,
    clue: "Örnek bir kriptik metin.",
    length: 5,
    difficulty: "Kolay",
    author: "Örnek Yazar",
    answer: "cevap",
    definition: {
        target: "metin",
        hint: "Örnek tanım ipucu metni.",
    },
    indicators: {
        targets: ["bir"],
        hint: "Örnek yönerge ipucu metni.",
    },
    fodder: {
        targets: ["kriptik"],
        hint: "Örnek malzeme ipucu metni.",
    },
    explanation: "Örnek kriptik cevap açıklaması.",
};
