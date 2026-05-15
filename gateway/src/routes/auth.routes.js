const express = require('express');
const { authLimiter } = require('../middleware/rateLimiter');
const { springProxy } = require('../proxy/springProxy');

const router = express.Router();

// Public — no JWT required
router.use('/register', authLimiter, springProxy);
router.use('/login',    authLimiter, springProxy);

module.exports = router;
