const express = require('express');
const router = express.Router();
const { 
  getPlatformEarnings, 
  initiatePaypalTransfer,
  completePaypalTransfer
} = require('../controllers/platformEarnings');

router.get('/', getPlatformEarnings);
router.post('/transfer', initiatePaypalTransfer);
router.get('/transfer/complete/:orderId', completePaypalTransfer);

module.exports = router;


