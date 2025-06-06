import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    token: {
        type:Number,
        required: true,
        default:0        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });
export const Token = mongoose.model("Token", tokenSchema);