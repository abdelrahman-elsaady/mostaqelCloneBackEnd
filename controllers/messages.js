const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    
    // Create and save the new message
    const newMessage = await messageModel.create({
      conversationId,
      senderId,
      content,
      readBy: [senderId] // Mark as read by sender
    });

    // Get conversation with populated fields
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: newMessage._id },
      { new: true }
    )
    .populate('client', 'firstName lastName profilePicture')
    .populate('freelancerId', 'firstName lastName profilePicture')
    .populate('projectId', 'title');

    if (!conversation) {
      throw new Error('Conversation not found');
    }

    const ably = req.app.get('ably');

    // Determine recipient ID and sender details
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    const sender = conversation.client._id.toString() === senderId 
      ? conversation.client 
      : conversation.freelancerId;

    // Prepare notification data
    const notificationData = {
      _id: newMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: `${sender.firstName} ${sender.lastName}`,
      senderAvatar: sender.profilePicture,
      content: newMessage.content,
      timestamp: newMessage.createdAt
    };

    // Send notification to recipient's channel
    const recipientChannel = ably.channels.get(`user-${recipientId}`);
    
    try {
      await recipientChannel.publish('message-notification', notificationData);
      console.log(`Notification sent to user-${recipientId}`);
    } catch (error) {
      console.error('Error publishing notification:', error);
    }

    res.status(201).json({
      success: true,
      message: newMessage,
      notificationSent: true
    });

  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error sending message'
    });
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








