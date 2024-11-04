const messageModel = require('../models/messages');
const Conversation = require('../models/conversation');



// In your message controller (e.g., controllers/messages.js)
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;
    const newMessage = { conversationId, senderId, content };

    const savedMessage = await messageModel.create(newMessage);
    const populatedMessage = await messageModel.findById(savedMessage._id).populate('senderId');

    const conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      { lastMessage: savedMessage._id },
      { new: true }
    ).populate('projectId client freelancerId');

    const pusher = req.app.get('pusher');
    
    // Send the populated message to the conversation channel
    pusher.trigger(`conversation-${conversationId}`, 'new-message', populatedMessage);

    // Determine recipient and send notification
    const recipientId = conversation.client._id.toString() == senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();



    const sender = conversation.client._id.toString() == senderId 
      ? conversation.client 
      : conversation.freelancerId;

      if(recipientId != senderId){

    pusher.trigger(`user-${recipientId}`, 'message-notification', {
      _id: savedMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: sender.firstName,
      senderAvatar: sender.profilePicture,
      content: savedMessage.content,
        createdAt: savedMessage.createdAt
      });
    }else{
        
    pusher.trigger(`user-${senderId}`, 'message-notification', {
      _id: savedMessage._id,
      conversationId: conversation._id,
      projectTitle: conversation.projectId.title,
      senderName: sender.firstName,
      senderAvatar: sender.profilePicture,
      content: savedMessage.content,
        createdAt: savedMessage.createdAt
      });
    }

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








