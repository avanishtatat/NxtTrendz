import User from "../models/User";
import { checkPrimeStatus } from "../utils/checkPrimeStatus";
import { generateToken } from "../utils/generateToken";

export const register = async (req, res) => {
    const { name, email, password } = req.body; 
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }


    try {
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({ error: "Email is already registered." });
        }

        const user = new User({ name, email, password, isPrime: false, primeExpiresAt: null });
        await user.save(); 
        const token = generateToken(user); // Generate JWT token for the newly registered user
        res.status(201).json({ message: "User registered successfully.", token, user: { id: user._id, name: user.name, email: user.email, isPrime: user.isPrime, primeExpiresAt: user.primeExpiresAt } });
    } catch (error) {
        console.error("Error during user registration:", error);
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
        let isMatch = false; 
        if (user) {
            isMatch = await user.comparePassword(password); 
        } else {
            // Perform dummy comparison to prevent timing attacks even when user is not found
            const bcrypt = await import("bcryptjs");
            await bcrypt.compare(password, "$2a$10$dummyHashToPreventTimingAttack12345678901234567890"); // Compare with a dummy hash
        }
        
        if (!user || !isMatch) {
            return res.status(400).json({ error: "Invalid Credentials." });
        }
        const token = generateToken(user); // Generate JWT token for the authenticated user
        res.json({ message: "Login successful.", token, user: { id: user._id, name: user.name, email: user.email, isPrime: user.isPrime, primeExpiresAt: user.primeExpiresAt } });
    } catch (error) {
        console.error("Error during user login:", error);
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
        if (updated) {
            console.log(`User ${updatedUser.email} prime status updated to ${updatedUser.isPrime} due to expiration.`);
        }
        res.json({ user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isPrime: updatedUser.isPrime, primeExpiresAt: updatedUser.primeExpiresAt } });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error." });
    }
}