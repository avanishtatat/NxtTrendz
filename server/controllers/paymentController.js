import Cart from "../models/Cart.js"
import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
import { clearCartFunc } from "./cartController.js";

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const verifySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const body = razorpayOrderId + "|" + razorpayPaymentId;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");
    return expectedSignature === razorpaySignature;
}

export const createOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Cannot create order." });
        }
        const totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        const options = { amount: totalAmount * 100, currency: "INR", receipt: `receipt_${Date.now()}` };
        const order = await razorpayInstance.orders.create(options);
        return res.status(201).json({ razorpayOrderId: order.id, amount: order.amount, currency: order.currency });
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
        const existingOrder = await Order.findOne({ "payment.razorpayOrderId": razorpayOrderId });
        if (existingOrder) {
            return res.status(200).json({ error: "This order has already been processed.", orderId: existingOrder._id });
        }
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Cannot verify payment." });
        }
        const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (isValid) {
            const order = new Order({
                userId: req.user.id,
                items: cart.items,
                payment: {
                    razorpayPaymentId,
                    razorpayOrderId,
                    razorpaySignature,
                    status: "paid",
                },
                status: "processing",
            });
            await order.save();
            await clearCartFunc(req.user.id); // Clear the cart after successful order creation
            return res.status(200).json({ message: "Payment verified and order created successfully.", orderId: order._id });
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
        const options = { amount: 499 * 100, currency: "INR", receipt: `prime_receipt_${Date.now()}` };
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
        const existingOrder = await Order.findOne({ "payment.razorpayOrderId": razorpayOrderId });
        if (existingOrder) {
            return res.status(200).json({ error: "This order has already been processed.", orderId: existingOrder._id });
        }
        const isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        if (isValid) {
            const user = await User.findByIdAndUpdate(req.user.id, {
                $set: {
                    isPrime: true,
                    primeExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Set prime expiry to 30 days from now
                }
            }, { new: true });
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