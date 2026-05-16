import axios from "axios";
import User from "../models/User.js";
import { checkPrimeStatus } from "../utils/checkPrimeStatus.js";
import { getNxtWaveToken } from "../utils/nxtWaveProxy.js";


export const getProducts = async (req, res) => {
    const { prime } = req.user; // Get isPrime from the authenticated user
    try {
        const nxtWaveToken = await getNxtWaveToken(prime);
        if (!nxtWaveToken.success) {
            return res.status(503).json({ error: "Service Unavailable right now. Please try again later." });
        }
        const response = await axios.get("https://apis.ccbp.in/products", {
            headers: {
                Authorization: `Bearer ${nxtWaveToken.token}`,
            },
            params: req.query, // Forward any query parameters for filtering/pagination to the upstream API
            validateStatus: (status) => status >= 200 && status < 500, // Accept all responses to handle them gracefully
        });
        if (response.status === 200) {
            return res.json({ products: response.data.products });
        } 
        if (response.status === 404) {
            return res.status(404).json({ error: "Products not found." });
        }
        return res.status(502).json({ error: "Unexpected response from upstream service." });
    } catch (error) {
        console.error("Error fetching products:", error?.response?.data?.error_msg || error.message);
        return res.status(500).json({ error: "An error occurred while fetching products." });
    }
}

export const getPrimeProducts = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findById(id); 
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        const {user: updatedUser} = await checkPrimeStatus(user); // Check and update prime status if needed
        // console.log(`User ${updatedUser.email} prime status is ${updatedUser.isPrime}.`);
        if (!updatedUser.isPrime) {
            return res.status(403).json({ error: "Access denied as user is not a prime member." });
        }
        const nxtWaveToken = await getNxtWaveToken(true);
        if (!nxtWaveToken.success) {
            return res.status(503).json({ error: "Service Unavailable right now. Please try again later." });
        }
        const response = await axios.get(`https://apis.ccbp.in/prime-deals`, {
            headers: {
                Authorization: `Bearer ${nxtWaveToken.token}`,
                'Accept': 'application/json',
            },
            validateStatus: (status) => status < 500
        });
        if (response.status === 200) {
            return res.json({ primeDeals: response.data.prime_deals });
        } 
        if (response.status === 403) {
            return res.status(403).json({ error: "Access denied to prime deals. Please ensure your account has the necessary permissions." });
        }
        if (response.status === 404) {
            return res.status(404).json({ error: "Prime deals not found." });
        }
        return res.status(502).json({ error: "Unexpected response from upstream service." });
    } catch (error) {
        console.error("Error fetching prime deals:", error?.response?.data?.error_msg || error.message);
        return res.status(500).json({ error: "An error occurred while fetching prime deals." });
    }
}

export const getProductById = async (req, res) => {
    const { id } = req.params;
    const { prime } = req.user;
    try {
        const nxtWaveToken = await getNxtWaveToken(prime);
        if (!nxtWaveToken.success) {
            return res.status(503).json({ error: "Service Unavailable right now. Please try again later." });
        }
        const response = await axios.get(`https://apis.ccbp.in/products/${id}`, {
            headers: {
                Authorization: `Bearer ${nxtWaveToken.token}`,
            },
            validateStatus: (status) => status < 500
        });
        if (response.status === 200) {
            return res.json({ product: response.data });
        } 
        if (response.status === 404) {
            return res.status(404).json({ error: "Product not found." });
        }
        return res.status(502).json({ error: "Unexpected response from upstream service." });
    } catch (error) {
        console.error("Error fetching product:", error?.response?.data?.error_msg || error.message);
        return res.status(500).json({ error: "An error occurred while fetching the product." });
    }
}

