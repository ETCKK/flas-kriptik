import { z } from "zod";
import type { Cryptic } from "@/types";

const ANSWER_PATTERN = /^[a-zçğıöşü]+$/;

const targetSchema = z.string().trim().min(1, "Hedef boş olamaz.");
const hintTextSchema = z.string().trim().min(1, "İpucu metni boş olamaz.");

const definitionSchema = z.strictObject({
    target: targetSchema,
    hint: hintTextSchema,
});

const wordGroupSchema = z.strictObject({
    targets: z.array(targetSchema).min(1, "En az bir hedef olmalı; hedef yoksa bu alanı hiç eklemeyin."),
    hint: hintTextSchema,
});

export const crypticSchema = z
    .strictObject({
        id: z.string().trim().min(1, "Kimlik boş olamaz."),
        number: z.number().int("Numara tam sayı olmalı.").positive("Numara pozitif olmalı."),
        publishDate: z.iso.date("Yayın tarihi YYYY-AA-GG biçiminde geçerli bir tarih olmalı.").nullable(),
        clue: z.string().trim().min(1, "Kriptik metni boş olamaz."),
        length: z.number().int().positive(),
        author: z.string().trim().min(1, "Yazar boş olamaz."),
        difficulty: z.enum(["Kolay", "Orta", "Zor"]).optional(),
        answer: z
            .string()
            .regex(ANSWER_PATTERN, "Cevap yalnızca küçük harflerden oluşmalı; boşluk, işaret veya büyük harf içeremez."),
        definition: definitionSchema,
        indicators: wordGroupSchema.optional(),
        fodder: wordGroupSchema.optional(),
        explanation: z.string().optional(),
    })
    .superRefine((cryptic, ctx) => {
        const answerLength = [...cryptic.answer].length;
        if (answerLength !== cryptic.length) {
            ctx.addIssue({
                code: "custom",
                path: ["length"],
                message: `Harf sayısı (${cryptic.length}) cevabın uzunluğuyla (${answerLength}) eşleşmiyor.`,
            });
        }

        const checkTarget = (target: string, path: (string | number)[]) => {
            if (!cryptic.clue.includes(target)) {
                ctx.addIssue({
                    code: "custom",
                    path,
                    message: `"${target}" kriptik metninde bulunmuyor.`,
                });
            }
        };

        checkTarget(cryptic.definition.target, ["definition", "target"]);
        (["indicators", "fodder"] as const).forEach((field) => {
            cryptic[field]?.targets.forEach((target, index) => checkTarget(target, [field, "targets", index]));
        });
    }) satisfies z.ZodType<Cryptic>;

export const crypticCollectionSchema = z.array(crypticSchema).superRefine((cryptics, ctx) => {
    (["id", "number", "publishDate"] as const).forEach((field) => {
        const seen = new Map<string | number, number>();
        cryptics.forEach((cryptic, index) => {
            const value = cryptic[field];
            if (value === null) {
                return;
            }
            const firstIndex = seen.get(value);
            if (firstIndex !== undefined) {
                ctx.addIssue({
                    code: "custom",
                    path: [index, field],
                    message: `"${value}" değeri ${firstIndex}. kriptikte de kullanılıyor.`,
                });
            } else {
                seen.set(value, index);
            }
        });
    });
});
