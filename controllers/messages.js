const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const newMessage = { conversationId, senderId, content };

    const savedMessage = await messageModel.create(newMessage);
    const populatedMessage = await messageModel.findById(savedMessage._id)
      .populate('senderId', 'firstName lastName profilePicture');

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    )
    .populate('projectId', 'title')
    .populate('client', 'firstName lastName profilePicture')
    .populate('freelancerId', 'firstName lastName profilePicture');

    const pusher = req.app.get('pusher');
    
    // Send the populated message to the conversation channel
    pusher.trigger(`conversation-${conversationId}`, 'new-message', populatedMessage);

    // Determine recipient
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    const sender = conversation.client._id.toString() === senderId 
      ? conversation.client 
      : conversation.freelancerId;

    // Create notification payload
    const notificationPayload = {
      _id: savedMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: `${sender.firstName} ${sender.lastName}`,
      senderAvatar: sender.profilePicture,
      content: savedMessage.content,
      createdAt: savedMessage.createdAt,
      readBy: []
    };

    // Log the notification being sent
    console.log(`Sending notification to user-${recipientId}:`, notificationPayload);

    // Trigger the notification
    await pusher.trigger(
      `user-${recipientId}`,
      'message-notification',
      notificationPayload
    );

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








