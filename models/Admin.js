const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    //required: true
  },
  email: {
    type: String,
   // required: true,
    unique: true
  },
  role: {
    type: String,
    default: 'admin'
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password validation method
// AdminSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };


const adminModel = mongoose.model('Admin', AdminSchema);
module.exports = adminModel;
