import { Router } from 'express';
import { getAllOrders } from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.get('/orders', authenticateToken, requireAdmin, getAllOrders);

export default router;
