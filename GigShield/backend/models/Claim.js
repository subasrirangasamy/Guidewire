const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true },
    amount: { type: Number, required: true },
    disruptionType: { type: String, required: true }, // e.g., 'Heavy Rain', 'Extreme Heat'
    location: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Paid'], default: 'Pending' },
    triggerData: { type: Object, default: {} }, // E.g., Weather API response
    payoutDate: { type: Date },
    isFraudulent: { type: Boolean, default: false },
    fraudReason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Claim', ClaimSchema);
