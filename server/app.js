import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { pathToFileURL } from "url";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
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

// Start the server
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit with failure code
  }
};

const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  try {
    await mongoose.connection.close(); // Close MongoDB connection
    console.log("MongoDB connection closed");
    process.exit(0); // Exit with success code
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit with failure code
  }
};

const isDirectRun = process.argv[1]
  ? import.meta.url === pathToFileURL(process.argv[1]).href
  : false;

if (isDirectRun) {
  startServer();
  // Graceful shutdown handlers
  process.on("SIGTERM", async () => {
    await gracefulShutdown("SIGTERM");
  });

  process.on("SIGINT", async () => {
    await gracefulShutdown("SIGINT");
  });
}



export default app;
