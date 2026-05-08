import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Add index for faster queries by userId
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
          min: 0,
          max: 5,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      razorpayPaymentId: {
        type: String,
        default: null,
      },
      razorpayOrderId: {
        type: String,
        default: null,
      },
      razorpaySignature: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },
  },
  { timestamps: true },
);

// Pre-save hook to ensure that orders cannot be marked as shipped or delivered if payment is not completed
orderSchema.pre("save", function (next) {
  if (
    ["shipped", "delivered"].includes(this.status) &&
    this.payment?.status !== "paid"
  ) {
    return next(
      new Error(
        `Cannot update order status to ${this.status} when payment status is ${this.payment.status}. Please ensure payment is completed before updating order status.`,
      ),
    );
  }
  next();
});

// Pre-save hook to validate that totalAmount matches the sum of items
orderSchema.pre("save", function (next) {
    if (this.isNew) {
        // For new orders, calculate totalAmount from items
        this.totalAmount = this.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
        const calculatedTotal = this.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
        
        // Allow small floating-point discrepancies by using a tolerance value
        const tolerance = 0.01;
        if (Math.abs(calculatedTotal - this.totalAmount) > tolerance) {
            return next(
                new Error(
                    `Total amount ${this.totalAmount.toFixed(2)} does not match the sum of items $${calculatedTotal.toFixed(2)}. Please ensure the total amount is correct.`,
                ),
            );
        }
    }
    next();
});

// Validate that the order contains at least one item
orderSchema.path("items").validate(function (items) {
  return items && items.length > 0;
}, "Order must contain at least one item.");

const Order = mongoose.model("Order", orderSchema);

export default Order;
