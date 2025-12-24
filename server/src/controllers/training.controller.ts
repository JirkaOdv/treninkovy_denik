import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getAllTrainings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const trainings = await prisma.training.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        res.json(trainings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trainings' });
    }
};

export const getTrainingById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const training = await prisma.training.findFirst({
            where: { id, userId }
        });

        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }
        res.json(training);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching training' });
    }
};

export const createTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const { date, type, durationMinutes, feeling, notes, sprints, gym, jumps, totalDistance, totalLoad } = req.body;

        const training = await prisma.training.create({
            data: {
                userId,
                date: new Date(date),
                type,
                durationMinutes: Number(durationMinutes),
                feeling,
                notes,
                sprints: sprints || [],
                gym: gym || [],
                jumps: jumps || [],
                totalDistance: totalDistance ? Number(totalDistance) : null,
                totalLoad: totalLoad ? Number(totalLoad) : null
            }
        });

        res.status(201).json(training);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating training' });
    }
};

export const updateTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const data = req.body;

        const training = await prisma.training.findFirst({ where: { id, userId } });
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }

        const updated = await prisma.training.update({
            where: { id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            }
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating training' });
    }
};

export const deleteTraining = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        const training = await prisma.training.findFirst({ where: { id, userId } });
        if (!training) {
            res.status(404).json({ message: 'Training not found' });
            return;
        }

        await prisma.training.delete({ where: { id } });
        res.json({ message: 'Training deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting training' });
    }
};
