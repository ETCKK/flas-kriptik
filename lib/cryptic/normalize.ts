export function normalizeAnswer(answer: string): string {
    return answer.trim().normalize("NFC").toLocaleLowerCase("tr-TR");
}
