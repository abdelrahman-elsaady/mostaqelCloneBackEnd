


const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);












// const mongoose = require('mongoose');

// const messageSchema = new mongoose.Schema({
//     content: { 
//         type: String, 
//         required: true 
//     },
//     timestamp: { 
//         type: Date, 
//         default: Date.now 
//     },
//     status: { 
//         type: String, 
//         enum: ['sent', 'read'], 
//         default: 'sent' 
//     },
//     freelancerID: { 
//         type: mongoose.Schema.ObjectId, 
//         ref: 'user', required: true 
//     },
//     clientID: { 
//         type: mongoose.Schema.ObjectId, 
//         ref: 'user', required: true 
//     }
// });

// const messageModel = mongoose.model('message', messageSchema);

//  module.exports =messageModel