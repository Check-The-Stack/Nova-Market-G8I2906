import { Router } from 'express';
import { getAllOrders, updateOrderStatus, getAdminStats } from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Todas las rutas en admin requieren token y rol admin
router.use(authenticateToken);
router.use(requireAdmin);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/stats', getAdminStats);

export default router;
