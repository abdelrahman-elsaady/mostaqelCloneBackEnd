

// const { number } = require('joi');
const mongoose = require('mongoose')
 
const Schema = mongoose.Schema;

const proposalSchema = new Schema({

    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
      },
      freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
      },
      amount: {
        type: Number,
        required: true
      },
      deliveryTime: {
        type: Number,
        required: true
      },
      receivables: {
        type: Number,
        required: true
      },
      proposal: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
    });

    // proposalSchema.statics.findByProject = function(projectId) {
    //   return this.find({ project: projectId }).exec();
    // };

  let proposalModel = mongoose.model('proposals', proposalSchema);

  module.exports = proposalModel
