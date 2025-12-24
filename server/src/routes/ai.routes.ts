import { Router } from 'express';
import { analyzeTrainingMonth } from '../controllers/ai.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/analyze', authenticateToken, analyzeTrainingMonth);

export default router;
