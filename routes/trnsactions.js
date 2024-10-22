


const express = require('express');
const router = express.Router();
const User = require('../models/users');

router.post('/transfer', async (req, res) => {
  const { senderId, receiverId, amount } = req.body;
 console.log(senderId, receiverId, amount);
  try {
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (sender.totalBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.totalBalance -= amount;
    receiver.totalBalance += amount;

    await sender.save();
    await receiver.save();

    // Emit socket event
    const io = req.app.get('io');
    const connectedUsers = req.app.get('connectedUsers');
    const receiverSocketId = connectedUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('moneyReceived', { 
        senderId: sender._id, 
        senderName: sender.firstName + ' ' + sender.lastName,
        senderAvatar: sender.profilePicture,
        amount 
      });
    }

    res.status(200).json({ message: 'Transfer successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing transfer', error: error.message });
  }
});

module.exports = router;