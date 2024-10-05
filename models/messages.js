const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
    status: { 
        type: String, 
        enum: ['sent', 'read'], 
        default: 'sent' 
    },
    freelancerID: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user', required: true 
    },
    clientID: { 
        type: mongoose.Schema.ObjectId, 
        ref: 'user', required: true 
    }
});

const messageModel = mongoose.model('message', messageSchema);

 module.exports =messageModel