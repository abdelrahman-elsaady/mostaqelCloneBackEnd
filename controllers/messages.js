const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const newMessage = { conversationId, senderId, content };

    const savedMessage = await messageModel.create(newMessage);
    
    // Populate sender information
    const populatedMessage = await messageModel.findById(savedMessage._id)
      .populate('senderId', 'firstName lastName profilePicture');

    // Update conversation's last message
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    ).populate('projectId client freelancerId');

    const pusher = req.app.get('pusher');
    
    // Trigger new message event in conversation channel
    pusher.trigger(`conversation-${conversationId}`, 'new-message', populatedMessage);

    // Determine recipient and send notification
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    // Trigger notification in recipient's channel
    pusher.trigger(`user-${recipientId}`, 'message-notification', {
      _id: savedMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: populatedMessage.senderId.firstName,
      senderAvatar: populatedMessage.senderId.profilePicture,
      content: savedMessage.content,
      timestamp: savedMessage.createdAt
    });

    res.status(201).json(populatedMessage);
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








