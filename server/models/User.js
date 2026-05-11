import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address."],
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        isPrime: {
            type: Boolean,
            default: false,
        },
        primeExpiresAt: {
            type: Date,
            default: function() {
                return this.isPrime ? new Date(this.createdAt.getTime() + 30 * 24 * 60 * 60 * 1000) : null;
            }, // Default to 30 days from account creation if isPrime is true
        },
    },
    { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10); // password hashing with salt rounds = 10
        this.password = hashedPassword; // Store hashed password in the database
    }
});

// Method to compare candidate password with the stored hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
