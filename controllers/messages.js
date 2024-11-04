const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    // Find conversation and populate necessary fields
    const conversation = await Conversation.findById(conversationId)
      .populate('client')
      .populate('freelancerId')
      .populate('projectId');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create new message
    const newMessage = await messageModel.create({
      conversationId,
      senderId,
      content,
      readBy: [senderId]
    });

    // Populate the message with sender details
    const populatedMessage = await messageModel.findById(newMessage._id)
      .populate({
        path: 'senderId',
        select: '_id firstName lastName profilePicture'
      });

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: newMessage._id },
      { new: true }
    );

    const pusher = req.app.get('pusher');

    // Debug log
    console.log('Triggering Pusher event for conversation:', conversationId);

    // Broadcast message to conversation channel
    await pusher.trigger(
      `conversation-${conversationId}`,
      'new-message',
      {
        _id: populatedMessage._id,
        content: populatedMessage.content,
        senderId: populatedMessage.senderId,
        conversationId: populatedMessage.conversationId,
        createdAt: populatedMessage.createdAt,
        readBy: populatedMessage.readBy
      }
    );

    // Send notification to recipient
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    await pusher.trigger(
      `user-${recipientId}`,
      'message-notification',
      {
        _id: populatedMessage._id,
        conversationId: conversation._id,
        projectTitle: conversation.projectId.title,
        senderName: populatedMessage.senderId.firstName,
        senderAvatar: populatedMessage.senderId.profilePicture,
        content: populatedMessage.content,
        createdAt: populatedMessage.createdAt
      }
    );

    // Debug log
    console.log('Message sent and broadcasted successfully');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
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








