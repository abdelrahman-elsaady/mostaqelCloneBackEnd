const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const newMessage = { 
      conversationId, 
      senderId, 
      content,
      readBy: [senderId]
    };

    const savedMessage = await messageModel.create(newMessage);

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    ).populate('projectId client freelancerId');

    // Format message for Pusher to match client-side structure
    const messageForPusher = {
      _id: savedMessage._id,
      content: savedMessage.content,
      senderId: savedMessage.senderId,
      createdAt: savedMessage.createdAt,
      readBy: savedMessage.readBy
    };

    const pusher = req.app.get('pusher');
    
    // Trigger event to conversation channel
    pusher.trigger(`conversation-${conversationId}`, 'new-message', messageForPusher);

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};








exports.getMessages = async (req, res) => {
  try {
    console.log("getMessages");
    const { conversationId } = req.params;
    const messages = await messageModel.find({ conversationId: conversationId }).populate('senderId').sort('createdAt');
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};








