import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validationMiddleware.js';
import { createProductSchema, updateProductSchema } from '../schemas/productSchemas.js';

const router: Router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticateToken, requireAdmin, validateBody(createProductSchema), createProduct);
router.put('/:id', authenticateToken, requireAdmin, validateBody(updateProductSchema), updateProduct);
router.delete('/:id', authenticateToken, requireAdmin, deleteProduct);

export default router;
