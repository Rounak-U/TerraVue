// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
        type: String,
        required: function requiredPassword() {
            return !this.authProvider || this.authProvider === 'local';
        }
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    googleId: { type: String, index: true },
    avatar: { type: String },
    refreshTokens: { type: [String], default: [] },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
    lastLogin: { type: Date },
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
