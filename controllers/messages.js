const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    // Find conversation first
    const conversation = await Conversation.findById(conversationId)
      .populate('client')
      .populate('freelancerId')
      .populate('projectId');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create the message
    const newMessage = await messageModel.create({
      conversationId,
      senderId,
      content,
      readBy: [senderId] // Mark as read by sender
    });

    // Populate the message with sender details
    const populatedMessage = await messageModel.findById(newMessage._id)
      .populate('senderId', 'firstName lastName profilePicture');

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: newMessage._id },
      { new: true }
    );

    const pusher = req.app.get('pusher');
    
    // Broadcast the new message to the conversation channel
    console.log('Broadcasting to channel:', `conversation-${conversationId}`);
    pusher.trigger(`conversation-${conversationId}`, 'new-message', populatedMessage);

    // Determine recipient for notification
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    const sender = conversation.client._id.toString() === senderId 
      ? conversation.client 
      : conversation.freelancerId;

    // Send notification to recipient
    console.log('Sending notification to:', `user-${recipientId}`);
    pusher.trigger(`user-${recipientId}`, 'message-notification', {
      _id: newMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: sender.firstName,
      senderAvatar: sender.profilePicture,
      content: newMessage.content,
      createdAt: newMessage.createdAt
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








