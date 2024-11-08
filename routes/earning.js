
const express = require('express');
const router = express.Router();
const { getEarnings } = require('../controllers/earning');
// const { protect } = require('../middleware/authMiddleware');

router.get('/:userId', getEarnings);

module.exports = router;