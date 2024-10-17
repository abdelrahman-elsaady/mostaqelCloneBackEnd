

// routes/conversations.js
const express = require('express');
const router = express.Router();

const conversationController = require('../controllers/Conversation');

router.post('/', conversationController.createConversation);
router.get('/',  conversationController.getConversations);
router.get('/:id',  conversationController.getConversationsbyid);
module.exports = router;



// controllers/messageController.js
