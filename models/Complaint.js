// models/Complaint.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplaintSchema = new Schema({
  title: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    //required: true
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved'],
    default: 'Open'
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  resolvedDate: {
    type: Date
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    //required: true
  }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
