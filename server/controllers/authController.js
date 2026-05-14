import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { checkPrimeStatus } from "../utils/checkPrimeStatus.js";
import { generateToken } from "../utils/generateToken.js";

// Pre-computed dummy hash for timing-safe comparison when user not found
const DUMMY_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"; // Pre-computed hash for "dummyPassword" with 10 salt rounds

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (password.length < 8 || password.length > 128) {
    return res
      .status(400)
      .json({ error: "Password must be between 8 and 128 characters long." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    const user = new User({
      name,
      email,
      password,
      isPrime: false,
      primeExpiresAt: null,
    });
    await user.save();
    const token = generateToken(user); // Generate JWT token for the newly registered user
    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPrime: user.isPrime,
        primeExpiresAt: user.primeExpiresAt,
      },
    });
  } catch (error) {
    console.error("Error during user registration:", process.env.NODE_ENV === "production" ?  error.message : error );
    res.status(500).json({ error: "Internal server error." });
  }
};

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
      await bcrypt.compare(password, DUMMY_HASH);
    }

    if (!user || !isMatch) {
      return res.status(400).json({ error: "Invalid Credentials." });
    }
    const token = generateToken(user); // Generate JWT token for the authenticated user
    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isPrime: user.isPrime,
        primeExpiresAt: user.primeExpiresAt,
      },
    });
  } catch (error) {
    console.error("Error during user login:", process.env.NODE_ENV === "production" ?  error.message : error );
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Fetch user profile without password
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    const { updated, user: updatedUser } = await checkPrimeStatus(user); // Check and update prime status if needed
    if (updated) {
      console.log(
        `User ${updatedUser.email} prime status updated to ${updatedUser.isPrime} due to expiration.`,
      );
    }
    res.json({
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isPrime: updatedUser.isPrime,
        primeExpiresAt: updatedUser.primeExpiresAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", process.env.NODE_ENV === "production" ?  error.message : error );
    res.status(500).json({ error: "Internal server error." });
  }
};
