


const express = require('express');
const Message = require('../models/messages');
const router = express.Router();
const Conversation = require('../models/conversation');
const messageController = require('../controllers/messages');

router.post('/', messageController.sendMessage);
router.get('/:conversationId', messageController.getMessages);

router.post('/read/:messageId',  async (req, res) => {
    const {messageId} = req.params
    const {userId} = req.body
    console.log(req.body);
    
    console.log(messageId,userId)
    console.log("salah")
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { $addToSet: { readBy: userId } },
        { new: true }
      );
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });






  router.get('/recent/:userId', async (req, res) => {
    try {
      const recentConversations = await Conversation.find({
        $or: [{ client: req.params.userId }, { freelancerId: req.params.userId }]
      })
        .sort({ updatedAt: -1 })
        .limit(5)
        .populate('client', 'firstName lastName profilePicture')
        .populate('freelancerId', 'firstName lastName profilePicture')
        .populate('projectId', 'title')
        .populate('lastMessage');
  
      const formattedConversations = recentConversations.map(conv => {
        const otherUser = conv.client._id.toString() === req.params.userId ? conv.freelancerId : conv.client;
        return {
          conversationId: conv._id,
          projectTitle: conv.projectId.title,
          senderName: `${otherUser.firstName} ${otherUser.lastName}`,
          senderAvatar: otherUser.profilePicture,
          content: conv.lastMessage ? conv.lastMessage.content : '',
          time: conv.updatedAt.toLocaleString('ar-EG'),
          readBy: conv.lastMessage ? conv.lastMessage.readBy : []
        };
      });
  
      res.json(formattedConversations);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });







module.exports = router;












// const express = require('express')
// let router = express.Router()
// let {author,restrictTo}=require('../middlewares/authorization')


// let {saveMessage , showMessages , deleteMessage, updateMessage } = require('../controllers/messages')



// router.get('/' , showMessages)
// router.post('/' , saveMessage)
// router.delete('/:id' , deleteMessage)
// router.patch('/:id' , updateMessage)



// module.exports=router