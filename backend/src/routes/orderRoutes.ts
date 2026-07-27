import { Router } from 'express';
import { createOrder, getMyOrders, getAllOrders } from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { createOrderSchema } from '../schemas/orderSchemas.js';

const router: Router = Router();

router.post('/', authenticateToken, validateBody(createOrderSchema), createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/admin', authenticateToken, requireAdmin, getAllOrders);

export default router;
