const PlatformEarnings = require('../models/platformEarnings');

exports.getPlatformEarnings = async (req, res) => {
  try {
    const earnings = await PlatformEarnings.findOne()
      .populate('transactions.senderId', 'firstName lastName email profilePicture')
      .populate('transactions.receiverId', 'firstName lastName email profilePicture')
      .populate('transactions.projectId', 'title description');
      
    res.status(200).json(earnings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform earnings', error: error.message });
  }
};

exports.addPlatformEarnings = async (amount, projectId, senderId, receiverId) => {
  try {
    let platformEarnings = await PlatformEarnings.findOne();
    
    if (!platformEarnings) {
      platformEarnings = new PlatformEarnings({ totalEarnings: 0 });
    }

    platformEarnings.totalEarnings += amount;
    platformEarnings.transactions.push({
      amount,
      projectId,
      senderId,
      receiverId
    });

    await platformEarnings.save();
    return platformEarnings;
  } catch (error) {
    throw new Error('Error adding platform earnings: ' + error.message);
  }
}; 