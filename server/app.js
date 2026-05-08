import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config(); // Load environment variables from .env file

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
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  res.status(200).json({ status: "healthy", database: dbStatus });
});

// Start the server
const PORT = process.env.PORT || 5000;
(async function () {
  try {
    await connectDB(); // Connect to MongoDB
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1); // Exit with failure code
  }
})();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully...");
  try {
    await mongoose.connection.close(); // Close MongoDB connection
    console.log("MongoDB connection closed");
    process.exit(0); // Exit with success code
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit with failure code
  }
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  try {
    await mongoose.connection.close(); // Close MongoDB connection
    console.log("MongoDB connection closed");
    process.exit(0); // Exit with success code
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1); // Exit with failure code
  }
});
