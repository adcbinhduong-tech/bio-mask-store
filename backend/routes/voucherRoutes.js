const express = require('express');
const router = express.Router();
const voucherController = require('../controllers/voucherController');

// Routes
router.get('/', voucherController.getAllVouchers);
router.post('/validate', voucherController.validateVoucher);
router.post('/', voucherController.createVoucher);
router.delete('/:code', voucherController.deleteVoucher);

module.exports = router;
