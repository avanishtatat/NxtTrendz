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
            minlength: 6,
        },
        isPrime: {
            type: Boolean,
            default: false,
        },
        primeExpireAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

User.pre("save", async function () {
    if (this.isModified("password")) {
        const hashedPassword = await bcrypt.hash(this.password, 10); // Hashing can be added here
        this.password = hashedPassword; // Hashing can be added here
    }
});

User.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default User;
