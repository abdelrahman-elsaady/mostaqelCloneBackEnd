const express = require('express');
const router = express.Router();
const { 
  getPlatformEarnings, 
  initiatePaypalTransfer,
  completePaypalTransfer
} = require('../controllers/platformEarnings');
let {author,restrictTo}=require('../middlewares/authorization')

router.get('/', author, getPlatformEarnings);
router.post('/transfer', author, initiatePaypalTransfer);
router.get('/transfer/complete/:orderId', author, completePaypalTransfer);

module.exports = router;


