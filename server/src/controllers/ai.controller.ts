import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const analyzeTrainingMonth = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return res.status(500).json({ error: 'AI service not configured (Missing API Key)' });
        }

        // 1. Fetch data for last 30 days
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const trainings = await prisma.training.findMany({
            where: {
                userId: userId,
                date: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        if (trainings.length === 0) {
            return res.status(200).json({
                analysis: "Zatím nemáte v tomto měsíci žádné tréninky k analýze. Začněte trénovat a vraťte se později! 💪"
            });
        }

        // 2. Prepare context for AI
        const trainingSummary = trainings.map(t =>
            `- ${t.date.toISOString().split('T')[0]}: ${t.type}, ${t.durationMinutes} min, Pocit: ${t.feeling}, ${t.notes || ''}`
        ).join('\n');

        const prompt = `
Jsi zkušený atletický trenér. Analyzuj následující tréninkový deník uživatele za posledních 30 dní a poskytni stručné, motivační a užitečné zhodnocení.
Buď konkrétní, zmiň se o objemu, frekvenci a pocitech. Pokud vidíš nějaký problém (např. přetrénování, málo odpočinku), upozorni na to.
Max 3 odstavce. Formátuj výstup v Markdown.

Tréninky:
${trainingSummary}
        `;

        // 3. Call Gemini API
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ analysis: text });

    } catch (error) {
        console.error('AI Analysis Error:', error);
        res.status(500).json({ error: 'Failed to generate analysis' });
    }
};
