import { Router } from 'express';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeItemFromCart
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { addToCartSchema, updateCartItemSchema } from '../schemas/cartSchemas.js';

const router: Router = Router();

// Todas las rutas del carrito requieren autenticación JWT
router.use(authenticateToken);

router.get('/', getCart);
router.post('/items', validateBody(addToCartSchema), addItemToCart);
router.put('/items/:productId', validateBody(updateCartItemSchema), updateCartItem);
router.delete('/items/:productId', removeItemFromCart);

export default router;
