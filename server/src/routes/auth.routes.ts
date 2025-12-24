import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';

const controller = new AuthController();
const router = Router();

router.post('/register', controller.register.bind(controller));
router.post('/login', controller.login.bind(controller));

// Admin routes
router.get('/users', authenticateToken, controller.getAllUsers.bind(controller));
router.post('/users', authenticateToken, controller.createUser.bind(controller));
router.put('/users/:id', authenticateToken, controller.updateUser.bind(controller));
router.delete('/users/:id', authenticateToken, controller.deleteUser.bind(controller));

export const authRoutes = router;
