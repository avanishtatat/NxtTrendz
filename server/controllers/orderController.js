import mongoose from "mongoose";
import Order from "../models/Order.js";

export const getOrders = async (req, res) => {
    const { id } = req.user;
    try {
        const orders = await Order.find({ userId: id }).sort({ createdAt: -1 });
        return res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders:", error.message);
        return res.status(500).json({ error: "An error occurred while fetching orders." });
    }
}

export const getOrderById = async (req, res) => {
    const { id } = req.user;
    const { orderId } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: "Invalid order ID format." });
        }
        const order = await Order.findOne({ _id: orderId, userId: id });
        if (!order) {
            return res.status(404).json({ error: "Order not found." });
        }
        return res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching order by ID:", error.message);
        return res.status(500).json({ error: "An error occurred while fetching the order." });
    }
}