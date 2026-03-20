const Policy = require('../models/Policy');
const { calculateRisk, calculatePremium, getPrediction } = require('../utils/riskAssessment');

exports.getPolicy = async (req, res) => {
    try {
        const policy = await Policy.findOne({ userId: req.user.id, status: 'Active' });
        res.json(policy);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getQuote = async (req, res) => {
    try {
        const { coverageAmount, location } = req.body;
        const riskScore = calculateRisk(location);
        const weeklyPremium = calculatePremium(riskScore, coverageAmount);
        const prediction = getPrediction(location);
        res.json({ coverageAmount, location, riskScore, weeklyPremium, prediction });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.createPolicy = async (req, res) => {
    try {
        const { coverageAmount, location, weeklyPremium, riskScore } = req.body;
        await Policy.updateMany({ userId: req.user.id }, { status: 'Expired' });

        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + 7);
        const prediction = getPrediction(location);

        const policy = new Policy({
            userId: req.user.id,
            coverageAmount,
            weeklyPremium,
            location,
            riskScore,
            validUntil,
            status: 'Active',
            riskFactors: prediction === 'High' ? ['Severe Weather Predicted', 'Category: High Risk'] : ['Standard Risk', `Risk Level: ${prediction}`]
        });

        await policy.save();
        res.json(policy);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
