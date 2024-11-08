const express = require('express');
const router = express.Router();
const adminController = require('../controllers/platfoemEarning');
// const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/earnings', adminController.getPlatformEarnings);
router.get('/earnings/report',  adminController.getEarningsReport);

module.exports = router;