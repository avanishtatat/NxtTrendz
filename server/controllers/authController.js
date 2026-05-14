import User from "../models/User";
import { checkPrimeStatus } from "../utils/checkPrimeStatus";
import { generateToken } from "../utils/generateToken";

export const register = async (req, res) => {
    const { name, email, password, isPrime } = req.body; 
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (isPrime) {
        // Payment processing logic for prime subscription would go here
        // For this example, we will assume payment is successful and set prime status accordingly
    } 

    try {
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const primeExpiresAt = isPrime ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null; // Set expiration date for prime subscription (30 days from now)
        const user = new User({ name, email, password, isPrime: !!isPrime, primeExpiresAt });
        await user.save(); 
        const token = generateToken(user); // Generate JWT token for the newly registered user
        res.status(201).json({ message: "User registered successfully.", token, user: { id: user._id, name: user.name, email: user.email, isPrime: user.isPrime, primeExpiresAt: user.primeExpiresAt } });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const user = await User.findOne({ email }); 
        if (!user) {
            return res.status(400).json({ error: "Invalid Credentials." });
        }
        const isMatch = await user.comparePassword(password); 
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid Credentials." });
        }
        const token = generateToken(user); // Generate JWT token for the authenticated user
        res.json({ message: "Login successful.", token, user: { id: user._id, name: user.name, email: user.email, isPrime: user.isPrime, primeExpiresAt: user.primeExpiresAt } });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Fetch user profile without password
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const { updated, user: updatedUser } = await checkPrimeStatus(user); // Check and update prime status if needed
        res.json({ user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isPrime: updatedUser.isPrime, primeExpiresAt: updatedUser.primeExpiresAt } });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
}