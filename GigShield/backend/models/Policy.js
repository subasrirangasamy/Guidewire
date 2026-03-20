const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    coverageAmount: { type: Number, required: true },
    weeklyPremium: { type: Number, required: true },
    validUntil: { type: Date, required: true },
    location: { type: String, required: true },
    riskScore: { type: Number, default: 0 },
    status: { type: String, enum: ['Active', 'Expired', 'Cancelled'], default: 'Active' },
    riskFactors: [{ type: String }] // e.g., 'Heavy Rain', 'Extreme Heat'
}, { timestamps: true });

module.exports = mongoose.model('Policy', PolicySchema);
