import { Router } from 'express';
import { getAllTrainings, getTrainingById, createTraining, updateTraining, deleteTraining } from '../controllers/training.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken); // Protect all routes

router.get('/', getAllTrainings);
router.get('/:id', getTrainingById);
router.post('/', createTraining);
router.put('/:id', updateTraining);
router.delete('/:id', deleteTraining);

export default router;
