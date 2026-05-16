import express from "express";
import { getPrimeProducts, getProductById, getProducts } from "../controllers/productController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", authMiddleware, getProducts);
router.get("/prime", authMiddleware, getPrimeProducts);
router.get("/:id", authMiddleware, getProductById);

export default router;