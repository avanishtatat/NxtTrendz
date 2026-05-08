import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true, // Ensure one cart per user
  },
  items: [
    {
      productId: {
        type: Number,
        required: true,
      },
      title: {
        type: String,
        required: true,
        trim: true,
      },
      brand: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      imageUrl: {
        type: String,
        required: true,
        trim: true,
      },
      rating: {
        type: Number,
        required: false,
        min: 0,
        max: 5,
      }
    },
  ],
}, { timestamps: true });

// Pre-save hook to prevent duplicate productIds in the items array
cartSchema.pre("save", function (next) {
    // Prevent saving if there are duplicate productIds in the items array
    const productIds = new Set();
    for (const item of this.items) {
        if (productIds.has(item.productId)){
            return next(new Error("Duplicate productId found in cart items. Each productId must be unique within the cart."));
        }
        productIds.add(item.productId);
    }
    next();
});

// Also validate on updates 
cartSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
    const update = this.getUpdate();
    const items = update.$set?.items || update.items; 

    if (items && Array.isArray(items)) {
        const productIds = new Set(); 
        for (const item of items) {
            if (productIds.has(item.productId)) {
                return next(new Error("Duplicate productId found in cart items. Each productId must be unique within the cart."));
            }
            productIds.add(item.productId);
        }
    }
    next();
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
