


const projectModel = require('../models/project');


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
    .populate('proposals', 'freelancer amount deliveryTime proposal status')  
    .sort({ createdAt: -1 });

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


module.exports={createProject , getProjects  , getProjectById, updateProject , deleteProject, saveProposal  }