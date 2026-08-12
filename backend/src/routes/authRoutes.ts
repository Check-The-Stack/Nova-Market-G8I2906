import { Router } from 'express';
import { register, login, getMe, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../schemas/authSchemas.js';

const router: Router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.get('/me', authenticateToken, getMe);
router.post('/forgot-password', validateBody(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validateBody(resetPasswordSchema), resetPassword);

export default router;
