const cityRiskData = {
    'Mumbai': { base: 6, monsoonRisk: 2, heatRisk: 0, category: 'High' },
    'Delhi': { base: 5, monsoonRisk: 1, heatRisk: 3, category: 'High' },
    'Chennai': { base: 5, monsoonRisk: 2, heatRisk: 2, category: 'High' },
    'Bangalore': { base: 3, monsoonRisk: 1, heatRisk: 0, category: 'Medium' },
    'Pune': { base: 3, monsoonRisk: 1, heatRisk: 0, category: 'Medium' },
    'Hyderabad': { base: 3, monsoonRisk: 1, heatRisk: 1, category: 'Medium' }
};

const calculateRisk = (location) => {
    const cityData = cityRiskData[location] || { base: 4, monsoonRisk: 1, heatRisk: 1, category: 'Medium' };

    const currentMonth = new Date().getMonth();
    let riskScore = cityData.base;

    // Seasonal factors (June-Sept = Monsoon, April-June = Extreme Heat)
    if (currentMonth >= 5 && currentMonth <= 8) riskScore += cityData.monsoonRisk;
    if (currentMonth >= 3 && currentMonth <= 5) riskScore += cityData.heatRisk;

    return Math.min(Math.max(riskScore, 1), 10);
};

const getPrediction = (location) => {
    const riskScore = calculateRisk(location);
    if (riskScore >= 7) return 'High';
    if (riskScore >= 4) return 'Medium';
    return 'Low';
};

const calculatePremium = (riskScore, coverageAmount) => {
    const baseRate = 0.01; // 1%
    const riskMultiplier = 1 + (riskScore * 0.15); // +15% per risk point
    return Math.round(coverageAmount * baseRate * riskMultiplier);
};

module.exports = { calculateRisk, calculatePremium, getPrediction, cityRiskData };
