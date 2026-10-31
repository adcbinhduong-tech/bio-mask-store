const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes
router.post('/login', authController.login);
router.get('/me', authController.getMe);

module.exports = router;
