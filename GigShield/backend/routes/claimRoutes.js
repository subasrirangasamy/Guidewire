const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getClaims, triggerClaim } = require('../controllers/claimController');

router.get('/', auth, getClaims);
router.post('/trigger', auth, triggerClaim);

module.exports = router;
