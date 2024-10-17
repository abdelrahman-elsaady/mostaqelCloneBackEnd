

const Conversation = require('../models/conversation');

exports.createConversation = async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.user);

    const { projectId, freelancerId, clientId } = req.body;
    // const clientId = req.user.id;

    const conversation = new Conversation({
        projectId: projectId,
      client: clientId,
      freelancerId: freelancerId,
    });

    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: 'Error creating conversation' });
  }
};

exports.getConversationsbyid = async (req, res) => {
    console.log(req.user);
    console.log('aboda');
  try {
 
    // const userId = req.user.id;
    const conversations = await Conversation.findById(req.params.id).populate('projectId').populate('client').populate('freelancerId');
    
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};


exports.getConversations = async (req, res) => {
    try {
      const conversations = await Conversation.find().populate('projectId').populate('client').populate('freelancerId');
      res.status(200).json(conversations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching conversations' });
    }
  };