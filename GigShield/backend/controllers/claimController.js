const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const { checkDisruption, cityCoords } = require('../utils/weatherTrigger');

exports.getClaims = async (req, res) => {
    try {
        const claims = await Claim.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(claims);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.triggerClaim = async (req, res) => {
    try {
        const policy = await Policy.findOne({ userId: req.user.id, status: 'Active' });
        if (!policy) return res.status(400).json({ error: 'No active policy found' });

        const { mockGPS, override = false } = req.body;
        let isFraudulent = false;
        let fraudReason = '';

        // ADVANCED FRAUD: GPS Validation
        if (mockGPS) {
            const cityLoc = cityCoords[policy.location];
            if (cityLoc) {
                // rough Euclidean distance to mock a GPS boundary check
                const dist = Math.sqrt(Math.pow(mockGPS.lat - cityLoc.lat, 2) + Math.pow(mockGPS.lon - cityLoc.lon, 2));
                if (dist > 1.0) { // arbitrary threshold indicating >100km away
                    isFraudulent = true;
                    fraudReason = `GPS Mismatch: Device reported location far from insured city (${policy.location})`;
                }
            }
        }

        // ADVANCED FRAUD: Pattern checking (24 hr limit)
        if (!isFraudulent) {
            const recentClaim = await Claim.findOne({
                userId: req.user.id,
                createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            });
            if (recentClaim) {
                isFraudulent = true;
                fraudReason = 'Pattern Violation: Multiple claims filed within a 24-hour period.';
            }
        }

        // REAL-TIME WEATHER:
        const disruption = await checkDisruption(policy.location, override);

        if (!disruption.isDisrupted && !isFraudulent) {
            return res.json({ msg: 'No severe real-time disruption found at your coordinates.', triggered: false, disruption });
        }

        // Even if it wasn't disrupted locally, if they tripped the fraud detector doing something suspicious, we might log it as a rejected claim attempt
        const newClaim = new Claim({
            userId: req.user.id,
            policyId: policy._id,
            amount: policy.coverageAmount,
            disruptionType: isFraudulent ? 'Fraud Attempt' : disruption.disruptionType,
            location: policy.location,
            status: isFraudulent ? 'Rejected' : 'Approved',
            triggerData: disruption,
            isFraudulent,
            fraudReason
        });

        if (newClaim.status === 'Approved') {
            newClaim.status = 'Paid';
            newClaim.payoutDate = new Date();
        }

        await newClaim.save();

        // Notification msg format
        res.json({
            msg: isFraudulent ? `Claim Rejected: ${fraudReason}` : `Claim auto-triggered due to ${disruption.disruptionType} 💸`,
            triggered: true,
            claim: newClaim
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};
