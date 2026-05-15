const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { springProxy } = require('../proxy/springProxy');

const router = express.Router();

router.use('/projects/:projectId/tasks', authenticate, springProxy);
router.use('/tasks',                      authenticate, springProxy);

module.exports = router;
