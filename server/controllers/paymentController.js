import Cart from "../models/Cart.js"
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { clearCartFunc } from "./cartController.js";

const PRIME_PRICE_INR = 499; // Price for prime membership in INR

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay API keys must be defined in environment variables.");
}

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const verifySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    if (
        typeof razorpayOrderId !== "string" ||
        typeof razorpayPaymentId !== "string" ||
        typeof razorpaySignature !== "string" ||
        !/^[a-f0-9]{64}$/i.test(razorpaySignature)
    ) {
        return false;
    }
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");
    const receivedBuffer = Buffer.from(razorpaySignature, "hex");
    if (expectedBuffer.length !== receivedBuffer.length) {
        return false;
    }
    return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Cannot create order." });
        }
        const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const options = { amount: totalAmount * 100, currency: "INR", receipt: `receipt_${Date.now()}` };
        const razorpayOrder = await razorpayInstance.orders.create(options);
        await Order.create({
            userId: req.user.id,
            items: cart.items,
            status: "pending",
            payment: {
                razorpayOrderId: razorpayOrder.id,
                status: "pending",
            },
        });
        return res.status(201).json({ razorpayOrderId: razorpayOrder.id, amount: razorpayOrder.amount, currency: razorpayOrder.currency });
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);
        return res.status(500).json({ error: "An error occurred while creating the order." });
    }
}

export const verifyPayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ error: "Missing required payment details." });
    }
    try {
        const existingOrder = await Order.findOne({
            userId: req.user.id,
            "payment.razorpayOrderId": razorpayOrderId,
        });
        if (!existingOrder) {
            return res.status(404).json({ error: "Order not found for verification." });
        }
        if (existingOrder.payment?.status === "paid") {
            return res.status(409).json({ error: "This order has already been processed.", orderId: existingOrder._id });
        }
        const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (isValid) {
            existingOrder.payment.razorpayPaymentId = razorpayPaymentId;
            existingOrder.payment.razorpaySignature = razorpaySignature;
            existingOrder.payment.status = "paid";
            existingOrder.status = "processing";
            await existingOrder.save();
            await clearCartFunc(req.user.id); // Clear the cart after successful order creation
            return res.status(200).json({ message: "Payment verified and order created successfully.", orderId: existingOrder._id });
        } else {
            return res.status(400).json({ error: "Invalid payment signature." });
        }
    } catch (error) {
        console.error("Error verifying payment:", error.message);
        return res.status(500).json({ error: "An error occurred while verifying the payment." });
    }
}

export const createPrimeOrder = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        if (user.isPrime && user.primeExpiresAt > new Date()) {
            return res.status(400).json({ error: "You are already a prime member.", primeExpiresAt: user.primeExpiresAt });
        }
        const options = { amount: PRIME_PRICE_INR * 100, currency: "INR", receipt: `prime_receipt_${Date.now()}` };
        const primeOrder = await razorpayInstance.orders.create(options);
        return res.status(201).json({ razorpayOrderId: primeOrder.id, amount: primeOrder.amount, currency: primeOrder.currency });
    } catch (error) {
        console.error("Error creating prime order:", error.message);
        return res.status(500).json({ error: "An error occurred while creating the prime order." });
    }
}

export const verifyPrimePayment = async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return res.status(400).json({ error: "Missing required payment details." });
    }
    try {
        const alreadyUsed = await User.findOne({ "primePayment.razorpayOrderId": razorpayOrderId });
        if (alreadyUsed) {
            return res.status(409).json({ error: "This prime order has already been processed." });
        }
        const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (isValid) {
            const user = await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    isPrime: true,
                    primeExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set prime expiry to 30 days from now
                    primePayment: {
                        razorpayOrderId,
                        razorpayPaymentId,
                        razorpaySignature,
                        paidAt: new Date(),
                    },
                }
            }, { returnDocument: "after" });
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }
            const token = generateToken(user); // Generate a new token to reflect updated prime status
            return res.status(200).json({ message: "Prime membership activated successfully.", token, user: {
                id: user._id,
                isPrime: user.isPrime,
                primeExpiresAt: user.primeExpiresAt
            } });
        } else {
            return res.status(400).json({ error: "Invalid payment signature." });
        }
    } catch (error) {
        console.error("Error verifying prime payment:", error.message);
        return res.status(500).json({ error: "An error occurred while verifying the prime payment." });
    }
}