import jwt from "jsonwebtoken";

// Function to generate a JWT token for a user
export const generateToken = (user) => {
    // Ensure the user object has an _id field
    if (!user || !user._id) {
        throw new Error("Invalid user object. User must have an _id field.");
    }
    
    // Create a payload with user information (you can include more fields as needed)
    const payload = {
        id: user._id,
        prime: user.isPrime ?? false, // Include prime status in the token payload
    }

    // Ensure that the JWT_SECRET environment variable is defined
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET environment variable is not defined.");
    }

    // Sign the token with a secret key and set an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" }); // Token expires in 7 days

    if (!token) {
        throw new Error("Failed to generate token.");
    }

    return token;
}