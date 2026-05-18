import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js';
import { addItemToCart, clearCart, getCart, removeItem, updateItem } from '../controllers/cartController.js';
const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all cart routes
router.get("/", getCart);
router.post("/", addItemToCart);
router.patch("/:productId", updateItem);
router.delete("/", clearCart); // Specific route to clear the entire cart
router.delete("/:productId", removeItem); // Dynamic route to remove a specific item from the cart

export default router;