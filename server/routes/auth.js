import express from "express";
const router = express.Router(); 
import { registerUser, loginUser, getProfile } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

// Registration route 
router.post("/register", registerUser);

// Login route 
router.post("/login", loginUser); 

// Protected route to get user profile
router.get("/profile", authMiddleware, getProfile);

export default router;