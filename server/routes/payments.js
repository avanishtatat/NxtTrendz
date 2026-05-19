import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createOrder, createPrimeOrder, verifyPayment, verifyPrimePayment } from "../controllers/paymentController.js";
const router = express.Router();

router.use(authMiddleware); // Apply authentication middleware to all payment routes
router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.post("/create-prime-order", createPrimeOrder);
router.post("/verify-prime-payment", verifyPrimePayment);

export default router;