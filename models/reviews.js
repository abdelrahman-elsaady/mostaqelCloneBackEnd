const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    professionalism: { type: Number, min: 1, max: 5 },
    communication: { type: Number, min: 1, max: 5 },
    qualityOfWork: { type: Number, min: 1, max: 5 },
    expertise: { type: Number, min: 1, max: 5 },
    onTimeDelivery: { type: Number, min: 1, max: 5 },
    wouldHireAgain: { type: Number, min: 1, max: 5 }
  }, { timestamps: true });
const reviwModel= mongoose.model('Review', reviewSchema);

module.exports = reviwModel