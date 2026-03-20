const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Claim = require('../models/Claim');
const Policy = require('../models/Policy');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: 'Access denied. Admin only.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPolicies = await Policy.countDocuments({ status: 'Active' });
        const claims = await Claim.find();

        const paidClaimsCount = claims.filter(c => c.status === 'Paid').length;
        const fraudulentClaims = claims.filter(c => c.isFraudulent).length;

        // Disruption stats breakdown
        const disruptionStats = claims.reduce((acc, curr) => {
            acc[curr.disruptionType] = (acc[curr.disruptionType] || 0) + 1;
            return acc;
        }, {});

        // Top Risky Cities (Cities with most claims)
        const cityClaimCount = {};
        claims.forEach(c => {
            if (c.status === 'Paid') cityClaimCount[c.location] = (cityClaimCount[c.location] || 0) + 1;
        });

        const topRiskyCities = Object.keys(cityClaimCount).map(city => ({
            name: city, claims: cityClaimCount[city]
        })).sort((a, b) => b.claims - a.claims).slice(0, 5);

        // Compute Success Rate
        const claimSuccessRate = claims.length > 0 ? ((paidClaimsCount / claims.length) * 100).toFixed(1) : 0;

        res.json({
            totalUsers,
            totalPolicies,
            paidClaimsCount,
            fraudulentClaims,
            disruptionStats,
            topRiskyCities,
            claimSuccessRate
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
