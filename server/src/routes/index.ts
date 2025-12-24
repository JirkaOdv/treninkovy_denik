import { Router } from 'express';
import authRoutes from './auth.routes';
import trainingRoutes from './training.routes';
import aiRoutes from './ai.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/trainings', trainingRoutes);
router.use('/ai', aiRoutes);

export default router;
