const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');
const conversationController = require('../controllers/Conversation');
let {author,restrictTo}=require('../middlewares/authorization')

router.post('/', author, conversationController.createConversation);
router.get('/', conversationController.getConversations);
router.get('/:id', author, conversationController.getConversationsbyid);
router.patch('/:id', author, conversationController.updateConversationStatus);
router.get('/user/:id', author, async (req, res) => {
    try {
      const userId = req.params.id;
      const conversations = await Conversation.find({
        $or: [{ client: userId }, { freelancerId: userId }]
      })
      .populate('projectId')
      .populate({
        path: 'client freelancerId',
        select: 'firstName lastName jobTitle  profilePicture',
      })
      .populate({
        path: 'lastMessage',
        select: 'content createdAt readBy'
      });
      const formattedConversations = conversations.map(conv => ({
        _id: conv._id,
        project: {
          _id: conv.projectId._id,
          title: conv.projectId.title
        },
        otherUser: conv.client._id.toString() == userId ? conv.freelancerId : conv.client,
        lastMessage: conv.lastMessage,
        hasUnreadMessages: conv.lastMessage && !conv.lastMessage.readBy.includes(userId)
      }));
      res.status(200).json({formattedConversations,conversations});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;



// controllers/messageController.js
