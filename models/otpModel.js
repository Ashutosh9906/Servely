import { Schema, model } from "mongoose";

const otpSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    otp: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const Otp = model("otps", otpSchema);

export default Otp;