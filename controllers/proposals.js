const proposalModel = require("../models/proposals");
const projectModel = require("../models/project");
const Ably = require('ably');
const userModel = require("../models/users");

let showProposals = async (req, res) => {
  try {
    const users = await proposalModel.find();
    res.status(200).json({ message: "success", users });
  } catch (err) {
    res.status(404).json(err);
  }
};

const mongoose = require('mongoose');

let getProposalsByProjectId = async (req, res) => {
  try {
    let { id } = req.params;
    
    console.log("Received project id:", id);
  
    let objectId = mongoose.Types.ObjectId.createFromHexString(id);
    console.log("Converted ObjectId:", objectId);

    // Log the total count of proposals in the database
    const totalProposals = await proposalModel.countDocuments();
    console.log("Total proposals in the database:", totalProposals);

    // Perform the query
    const proposals = await proposalModel.find({project:id}).populate('freelancer').populate('project');
    
    console.log("Number of proposals found:", proposals.length);
    console.log("Proposals:", JSON.stringify(proposals, null, 2));
    
    // if (proposals.length === 0) {
    //   console.log("No proposals found for this project id");
      
    //   // Check if the project exists
    //   const projectExists = await mongoose.model('Project').findById(objectId);
    //   if (!projectExists) {
    //     return res.status(404).json(projectExists);
    //   }
      
    //   return res.status(404).json({ message: "No proposals found for this project" });
    // }

    res.status(200).json({ message: "success", proposals });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      console.error("Invalid ObjectId:", id);
      return res.status(400).json({ message: "Invalid project ID format" });
    }
    console.error("Error in getProposalsByProjectId:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

let saveProposal = async (req, res) => {
  let newProposal = req.body;
  console.log(newProposal)
  try {
    // Save the proposal
    let savedProposal = await proposalModel.create(newProposal);

    // Update related collections
    await projectModel.findByIdAndUpdate(newProposal.project, { $push: { proposals: savedProposal._id } });
    await userModel.findByIdAndUpdate(newProposal.freelancer, { $push: { proposals: savedProposal._id } });

    // Get project details to find the owner
    const project = await projectModel.findById(newProposal.project).populate('client');
    const freelancer = await userModel.findById(newProposal.freelancer);

    // Initialize Ably
    const ably = new Ably.Realtime(process.env.ABLY_API_KEY);
    const channel = ably.channels.get(`user-${project.client._id}`);

    // Send notification
    channel.publish('proposal-received', {
      type: 'proposal',
      projectId: project._id,
      projectTitle: project.title,
      freelancerId: freelancer._id,
      freelancerName: freelancer.name,
      freelancerAvatar: freelancer.avatar,
      proposalAmount: newProposal.amount,
      timestamp: new Date()
    });

    res.status(200).json({ message: "proposal saved successfully", data: savedProposal });
  } catch (err) {
    res.status(404).json(err.message);
  }
};
let updateProposalById = async (req, res) => {

  try {
    let updateProposal = await proposals.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Proposal updated successfully" });

  } catch (error) {
    res.json({ message: error.message });
  }
};

let deleteProposal = async (req, res) => {
  let { id } = req.params;
  try {
    let Proposal = await proposals.findByIdAndDelete(id);

    if (Proposal) {
      res.status(200).json({ messege: "success" });
    } else {
      res.status(400).json({ message: "Proposal doesn't exist" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  showProposals,
  saveProposal,
  deleteProposal,
  updateProposalById,
  getProposalsByProjectId,
};
