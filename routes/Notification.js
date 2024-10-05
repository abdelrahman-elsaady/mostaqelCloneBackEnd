const express = require('express');
const router = express.Router();
const { createNotification  , getNotificationsByUser ,updateNotification , deleteNotification} = require('../controllers/Notification');
let {author,restrictTo}=require('../middlewares/authorization')


router.post('/', createNotification);

router.get('/', getNotificationsByUser);

router.patch('/:id', updateNotification)
router.delete('/:id', deleteNotification);

module.exports = router;
