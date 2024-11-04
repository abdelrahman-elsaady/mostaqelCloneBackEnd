const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const newMessage = { conversationId, senderId, content };

    const savedMessage = await messageModel.create(newMessage);

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    ).populate('projectId client freelancerId');
    
    const ably = req.app.get('ably');
    
    // Publish to conversation channel
    const conversationChannel = ably.channels.get(`conversation-${conversationId}`);
    await conversationChannel.publish('new-message', {
      _id: savedMessage._id,
      content: savedMessage.content,
      senderId: savedMessage.senderId,
      createdAt: savedMessage.createdAt,
      readBy: savedMessage.readBy
    });

    // Send notification to recipient
    const recipientId = conversation.client._id.toString() != senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    const userChannel = ably.channels.get(`user-${recipientId}`);
    await userChannel.publish('message-notification', {
      _id: savedMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: conversation.client._id.toString() === senderId ? conversation.client.firstName : conversation.freelancerId.firstName,
      senderAvatar: conversation.client._id.toString() === senderId ? conversation.client.profilePicture : conversation.freelancerId.profilePicture,
      content: savedMessage.content
    });

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








