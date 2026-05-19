import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getOrderById, getOrders } from '../controllers/orderController.js';
const router = express.Router();

router.use(authMiddleware);
router.get('/', getOrders);
router.get("/:orderId", getOrderById);

export default router