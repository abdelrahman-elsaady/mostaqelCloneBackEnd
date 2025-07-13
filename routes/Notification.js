const express = require('express');
const router = express.Router();
const { createNotification, getNotificationsByUser, updateNotification, deleteNotification } = require('../controllers/Notification');
let {author,restrictTo}=require('../middlewares/authorization')

router.post('/', author, createNotification);
router.get('/', getNotificationsByUser);
router.put('/:id', author, updateNotification);
router.delete('/:id', author, deleteNotification);

module.exports = router;
