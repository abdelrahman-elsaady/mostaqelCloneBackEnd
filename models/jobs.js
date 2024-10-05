const mongoose = require("mongoose");

let jobsSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  minBudget: {
    type: Number,
    required: true,
    min: 0,
  },
  maxBudget: {
    type: Number,
    required: true,
    min: 0,
  },
  datePosted: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["open", "closed", "in progress"],
    default: "open",
  },
  requiredskills: {
    type: Array,
    item: {
      type: String,
    },
    required: true,
  },
  NumberOfOffers: {
    type: Number,
  },

  categoryID: {
    type: mongoose.Schema.ObjectId,
    ref: "categories",
    required: true,
  },
  clientID: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

let jobsModel = mongoose.model("job", jobsSchema);
module.exports = jobsModel;
