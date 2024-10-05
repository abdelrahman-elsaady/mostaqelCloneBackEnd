const jobsModel = require("../models/jobs");

let showJobs = async (req, res) => {
  try {
    let jobs = await jobsModel.find();
    res.status(200).json({ message: "success", jobs });
  } catch (err) {
    res.status(404).json(err);
  }
};

let saveJob = async (req, res) => {
  let newJob = req.body;
  try {
    let savedJob = await jobsModel.create(newJob);
    res
      .status(200)
      .json({ message: "Jobs saved successfully", data: savedJob });
  } catch (err) {
    res.status(404).json(err.message);
  }
};

let deleteJob = async (req, res) => {
  let { id } = req.params;
  try {
    
    let job = await jobsModel.findByIdAndDelete(id);

    if (job) {
      res.status(200).json({ messege: "Job Deleted successfully"});
    } else {
      res.status(400).json({ message: "Job is not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
let updateJob = async (req, res) => {

  try {
    let updatedJob = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Job updated successfully", data: updatedJob });

  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { showJobs, saveJob, deleteJob, updateJob };
