const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1d'
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

module.exports = mongoose.model("Token", tokenSchema);
