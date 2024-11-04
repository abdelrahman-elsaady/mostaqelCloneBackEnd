const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    
    // Create new message
    const newMessage = await messageModel.create({
      conversationId,
      senderId,
      content,
      readBy: [senderId]
    });

    // Populate sender details
    const populatedMessage = await messageModel.findById(newMessage._id)
      .populate('senderId', 'firstName lastName profilePicture');

    // Update conversation's last message
    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: newMessage._id },
      { new: true }
    ).populate('projectId client freelancerId');

    // Format message for Pusher
    const messageForPusher = {
      _id: populatedMessage._id,
      content: populatedMessage.content,
      senderId: populatedMessage.senderId._id, // Just send the ID
      createdAt: populatedMessage.createdAt,
      readBy: populatedMessage.readBy
    };

    const pusher = req.app.get('pusher');
    
    // Trigger new message event
    pusher.trigger(
      `conversation-${conversationId}`,
      'new-message',
      messageForPusher
    );

    // Send notification to recipient
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    pusher.trigger(`user-${recipientId}`, 'message-notification', {
      conversationId: conversation._id,
      message: messageForPusher
    });
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








