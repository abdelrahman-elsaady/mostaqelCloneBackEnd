// const { number } = require('joi');
// const mongoose = require('mongoose')
// let ProjectSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   description: {
//     type: String,
//     // required: true
//   },
//   status: {
//     type: String,
//     enum: ['Not Started', 'In Progress', 'Completed'],
//     default: 'Not Started'
//   },
//   startDate: {
//     type: Date,
//     default: Date.now
//   },
//   endDate: {
//     type: Date
//   },
//   userId: {
//     type: String,
//     ref: 'User',
//     // required: true
//   }
// });

// let projectModel =  mongoose.model('Project', ProjectSchema);
// module.exports = projectModel

const mongoose = require('mongoose');

// const bidSchema = new mongoose.Schema({
//   // ... (keep the bid schema as it was)
// });

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true,
    trim: true
  },
  description: {
    type: String,
    // required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    // required: true
  },
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'proposals'
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'categories',
    // required: true
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }],
  budget:{
    
    min: {
      type: Number,
      // required: true
    },
    max: {
      type: Number,
      // required: true
    }
  }
  ,
  deliveryTime: {
    type: String,
    // required: true
  },
  status: {
    type: String,
    enum: ['open', 'pending_payment', 'in_progress', 'completed', 'cancelled'],
    default: 'open'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  paymentStatus: {
    type: String,
    enum: ['UNPAID', 'ESCROW', 'RELEASED', 'REFUNDED'],
    default: 'UNPAID'
  },
  agreedAmount: {
    type: Number
  },
  acceptedProposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'proposals'
  },
  platformFee: {
    type: Number
  },
  escrowId: {
    type: String
  }
});

// Virtual for bid count
ProjectSchema.virtual('proposalsCount', {
  ref: 'proposals',
  localField: '_id',
  foreignField: 'project',
  count: true
});

// Ensure virtuals are included when converting document to JSON
ProjectSchema.set('toJSON', { virtuals: true });
ProjectSchema.set('toObject', { virtuals: true });
// ... (keep the virtual fields and other settings as they were)

let projectModel =  mongoose.model('Project', ProjectSchema);

module.exports = projectModel

// const Project = mongoose.model('Project', projectSchema);

// module.exports = Project;
// status: {
//   type: String,
//   enum: ['open', 'pending_payment', 'in_progress', 'completed', 'cancelled'],
//   default: 'open'
// },
// acceptedProposal: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'proposals'
// },
// paymentStatus: {
//   type: String,
//   enum: ['unpaid', 'pending', 'paid', 'refunded'],
//   default: 'unpaid'
// }