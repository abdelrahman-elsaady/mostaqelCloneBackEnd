


const projectModel = require('../models/project');
const proposalModel = require('../models/proposals');
const Transaction = require('../models/Transaction');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/users');
let createProject = async (req, res , next) => {

  let newProject = req.body;

  console.log(newProject)
  try {
    let project = await projectModel.create(newProject);



    res.status(200).json({ message: "user project successfully", data: project });
     

  } catch (err) {
    next({statusCode:404})
  }

};

let getProjects = async (req, res) => {
  try {

    const projects = await projectModel.find()
    .populate('client')
    .populate('category', 'name')
    .populate('skills')
    .populate('proposals', 'freelancer amount _id deliveryTime proposal status')  
    .sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

let getProjectsByClient = async (req, res) => {
  let { id } = req.params;
  console.log(id)
  try {
    const projects = await projectModel.find({ client: id }).populate('client').populate('category', 'name');
    res.status(200).json(projects);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


let saveProposal = async (req, res) => {
  console.log(req.params)
  // console.log(req.body)
  try {
    const { id } = req.params;
    const newProposal = req.body;

    const project = await projectModel.findById(id);
console.log(project)
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // const newProposal = {
    //   freelancer,
    //   amount,
    //   deliveryTime,
    //   proposal,
    //    status
    // };

    project.proposals.push(newProposal);
    await project.save();

    res.status(201).json({ message: "Proposal added successfully", proposal: newProposal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving proposal", error: error.message });
  }
};
// Get a single project by ID

let getProjectById = async (req, res) => {
  let { id } = req.params;

  try {
    const project = await projectModel.findById( id ).populate('skills')
    .populate('category')
    .populate('client')
    .populate({
      path: 'proposals',
      populate: {
        path: 'freelancer',
        // select: 'name email profilePicture' 
      }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

let updateProject = async (req, res) => {
  console.log(req.body)
  console.log(req.params)
 try {
       await projectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({message:"Project updated successfully"} )
    }
      catch (error) {
      res.json({message:error.message})
}
};

// Delete a project
let deleteProject = async (req, res) => {
  let {id}=req.params
  try{
   let project =await projectModel.findByIdAndDelete(id)

     if(project){
       res.status(200).json({messege:"deleted success"})
     }else{
      res.status(400).json({message:"project doesn't exist"})

     }
  }
  catch(err){
      res.status(400).json({message: err.message})

  }
};

let acceptProposal = async (req, res) => {
  try {
    const { projectId, proposalId,userId } = req.body;
    console.log(req.body)
    // Verify the user is the project owner
    const project = await projectModel.findById(projectId).populate('client');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.client._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to accept proposals for this project' });
    }

    // Get the proposal
    const proposal = await proposalModel.findById(proposalId)
      .populate('freelancer')
      .populate('project');

    if (!proposal) {
      return res.status(404).json({ message: 'Proposal not found' });
    }

    // Calculate platform fee (15%)
    const platformFee = proposal.amount * 0.15;
    const totalAmount = proposal.amount + platformFee;

    // Create payment intent for the client
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        projectId,
        proposalId,
        freelancerId: proposal.freelancer._id.toString(),
        platformFee
      }
    });

    // Update project status
    project.status = 'pending_payment';
    project.acceptedProposal = proposalId;
    await project.save();

    // Create transaction record
    await Transaction.create({
      type: 'PAYMENT',
      amount: totalAmount,
      fee: platformFee,
      status: 'PENDING',
      project: projectId,
      payer: project.client._id,
      payee: proposal.freelancer._id,
      paymentMethod: 'STRIPE',
      paymentDetails: {
        paymentIntentId: paymentIntent.id
      }
    });
    
    res.json({
      success: true,
      proposal,
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    console.error('Error accepting proposal:', error);
    res.status(500).json({ 
      message: 'Error accepting proposal', 
      error: error.message 
    });
  }
};
// let updateProposal = async (req, res) => {
//   console.log(req.body)
//   console.log(req.params)
//   try {
//     const { id } = req.params;
//     const updatedProposal = req.body;

//     const project = await projectModel.findByIdAndUpdate(id, updatedProposal, { new: true });
//     res.status(200).json({ message: "Proposal updated successfully", proposal: project });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error updating proposal", error: error.message });
//   }
// }


module.exports={createProject , getProjects  , getProjectById, updateProject , deleteProject, saveProposal, getProjectsByClient , acceptProposal }