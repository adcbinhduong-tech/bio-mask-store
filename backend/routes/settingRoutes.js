const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// Routes
router.get('/', settingController.getSettings);
router.put('/', settingController.updateSettings);
router.post('/reset', settingController.resetToDefaults);

module.exports = router;
