import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payments.js";
import orderRoutes from "./routes/orders.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  }),
);
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus =
    { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" }[
      mongoose.connection.readyState
    ] || "unknown";
  res.status(200).json({ status: "healthy", database: dbStatus });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/orders", orderRoutes);

let server;
const gracefulShutdown = async (signal, server) => {
  console.log(`${signal} received, shutting down gracefully...`);

  try {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }

    await mongoose.connection.close();
    console.log("MongoDB connection closed.");

    process.exit(0);
  } catch (err) {
    console.error("Shutdown error:", err);
    process.exit(1);
  }
};

const safeShutdown = (signal) => {
  return gracefulShutdown(signal, server);
}

process.on("SIGTERM",async () => await safeShutdown("SIGTERM"));
process.on("SIGINT", async () => await safeShutdown("SIGINT"));

// Start the server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit with failure code
  }
};

startServer();

export default app;
