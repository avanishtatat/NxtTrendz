import express from "express";
import cors from "cors";
import connectDB from "./config/db";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  }),
);
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy");
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
  }
})();
