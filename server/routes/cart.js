import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addItemToCart, clearCart, getCart, removeItem, updateItem } from '../controllers/cartController.js';
const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addItemToCart);
router.patch("/", authMiddleware, updateItem);
router.delete("/:productId", authMiddleware, removeItem);
router.delete("/", authMiddleware, clearCart);

export default router;