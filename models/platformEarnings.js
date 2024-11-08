const mongoose = require('mongoose');

const platformEarningsSchema = new mongoose.Schema({
  totalEarnings: {
    type: Number,
    default: 0
  },
  transactions: [{
    amount: Number,
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('PlatformEarnings', platformEarningsSchema); 