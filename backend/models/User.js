// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshTokens: { type: [String], default: [] },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }],
});

module.exports = mongoose.model("User", userSchema);
