import type { Clue } from "@/types";

export const clue: Clue = {
    id: "001",
    date: "01.09.2026",
    clue: "Karışık kuruyemişe kafasızca koyulan engel?",
    length: 5,
    hints: [
        {
            text: "'Karışık' kelimesi bir anagram işaretçisi. İlişkisi olduğu bir kelimenin harflerini karıştırmamız gerekiyor.",
            type: "Yönerge",
        },
        {
            text: "'Kafasızca' kelimesi bir harf çıkarma işaretçisi. İlişkisi olduğu bir kelimenin belirli bir kısmını çıkarmamızı istiyor.",
            type: "Yönerge",
        },
    ],
    difficulty: "Kolay"
};

