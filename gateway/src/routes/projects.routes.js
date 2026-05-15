const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { springProxy } = require('../proxy/springProxy');

const router = express.Router();

// All project routes require auth
router.use('/', authenticate, springProxy);

module.exports = router;
