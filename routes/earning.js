
const express = require('express');
const router = express.Router();
const { getEarnings } = require('../controllers/earning');
let {author,restrictTo}=require('../middlewares/authorization')

router.get('/:userId', author, getEarnings);

module.exports = router;