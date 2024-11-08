const express = require('express');
const router = express.Router();
const { getPlatformEarnings } = require('../controllers/platformEarnings');

router.get('/', getPlatformEarnings);

module.exports = router; 