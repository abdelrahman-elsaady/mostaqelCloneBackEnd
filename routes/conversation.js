

// routes/conversations.js
const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation');
const conversationController = require('../controllers/Conversation');

router.post('/', conversationController.createConversation);
router.get('/',  conversationController.getConversations);
router.get('/:id',  conversationController.getConversationsbyid);
router.patch('/:id',  conversationController.updateConversationStatus);

router.get('/user/:id',  async (req, res) => {
    try {
      const userId = req.params.id;
      console.log(userId);
      console.log("req.params");
      const conversations = await Conversation.find({
        $or: [{ client: userId }, { freelancerId: userId }]
      })
      .populate('projectId', 'title', 'description')

      .populate({
        path: 'client freelancerId',
        select: 'firstName lastName jobTitle profilePicture',
        // match: { _id: { $ne: userId } }
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
