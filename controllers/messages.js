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
    

    const pusher = req.app.get('pusher');
    
    // Trigger event to conversation channel
    pusher.trigger(`conversation-${conversationId}`, 'new-message', savedMessage);

    // Send notification to the other user
    const recipientId = conversation.client._id.toString() === senderId 
      ? conversation.freelancerId._id.toString()
      : conversation.client._id.toString();

    pusher.trigger(`user-${recipientId}`, 'message-notification', {
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
  // try {
  //   const { conversationId, senderId, content } = req.body;
  //   const newMessage = { conversationId, senderId, content };

  //   const savedMessage = await messageModel.create(newMessage);

  //   const conversation = await Conversation.findByIdAndUpdate(
  //     conversationId,
  //     { lastMessage: savedMessage._id },
  //     { new: true }
  //   ).populate('projectId client freelancerId');

  //   const io = req.app.get('io');
    
  //   io.to(conversationId).emit('newMessage', savedMessage);

  //   // Send notification to the other user
  //   const recipientId = conversation.client._id.toString() === senderId 
  //     ? conversation.freelancerId._id.toString()
  //     : conversation.client._id.toString();

  //   console.log("Emitting messageNotification to:", recipientId);
  //   io.to(recipientId).emit('messageNotification', {
  //     _id: savedMessage._id,
  //     conversationId: conversation._id,
  //     projectTitle: conversation.projectId.title,
  //     senderName: conversation.client._id.toString() === senderId ? conversation.client.firstName : conversation.freelancerId.firstName,
  //     senderAvatar: conversation.client._id.toString() === senderId ? conversation.client.profilePicture : conversation.freelancerId.profilePicture,
  //     content: savedMessage.content
  //   });

  //   res.status(201).json(savedMessage);
  // } catch (error) {
  //   console.error('Error sending message:', error);
  //   res.status(500).json({ message: 'Error sending message' });
  // }
};
// exports.sendMessage = async (req, res) => {
//   try {
//     console.log(req.body);
//     console.log("message");
//     const {conversationId,senderId,content} = req.body
//     const newMessage = req.body;
//     // const senderId = req.user.id;

//     const savedMessage = await messageModel.create(newMessage);

//     const conversation = await Conversation.findByIdAndUpdate(
//       conversationId,
//       { lastMessage: savedMessage._id },
//       { new: true }
//     ).populate('projectId client freelancerId');
//   console.log(conversation)


//     const io = req.app.get('io');
//     const connectedUsers = req.app.get('connectedUsers');

//     io.to(conversationId).emit('newMessage', savedMessage);

//     io.to(savedMessage.conversationId.toString()).emit('message', savedMessage);
    
//     io.to(conversation.client.toString()).to(conversation.freelancerId.toString()).emit('newMessage', {
//       conversationId: conversation._id,
//       message: savedMessage
//     });

//     const recipientId = conversation.client.toString() === senderId 
//     ? conversation.freelancerId.toString()
//     : conversation.client.toString();

//   const recipientSocketId = connectedUsers.get(recipientId);
//   if (recipientSocketId) {
//     io.to(recipientSocketId).emit('messageNotification', {
//       conversationId: conversation._id,
//       projectTitle: conversation.projectId.title,
//       senderName: savedMessage.senderId.firstName,
//       senderAvatar: savedMessage.senderId.profilePicture,
//       message: savedMessage.content
//     });
//   }




//     res.status(201).json(savedMessage);
//   } catch (error) {
//     res.status(500).json({ message: 'Error sending message' });
//   }
// };

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








