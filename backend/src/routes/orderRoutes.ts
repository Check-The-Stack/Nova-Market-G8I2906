import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders } from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router: Router = Router();

router.post('/', authenticateToken, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/admin', authenticateToken, requireAdmin, getAllOrders);

export default router;
