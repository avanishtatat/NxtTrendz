import express from "express";
import { getPrimeProducts, getProductById, getProducts } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all product routes
router.get("/", getProducts);
router.get("/prime", getPrimeProducts);
router.get("/:id", getProductById);

export default router;