import { Router } from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { createOrderSchema } from '../schemas/orderSchemas.js';

const router: Router = Router();

router.post('/', authenticateToken, validateBody(createOrderSchema), createOrder);
router.get('/', authenticateToken, getMyOrders);

export default router;
