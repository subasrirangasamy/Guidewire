const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getPolicy, getQuote, createPolicy } = require('../controllers/policyController');

router.get('/', auth, getPolicy);
router.post('/quote', auth, getQuote);
router.post('/', auth, createPolicy);

module.exports = router;
