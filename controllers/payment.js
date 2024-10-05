const paymentModel = require("../models/payment");

let showOperation = async (req, res) => {
  try {
    let payments = await paymentModel.find();
    res.status(200).json({ message: "success", payments });
  } catch (err) {
    res.status(404).json(err);
  }
};

let saveOperation = async (req, res) => {
  let newOperation = req.body;
  try {
    let savedOperation = await paymentModel.create(newOperation);
    res
      .status(200)
      .json({ message: "Operation saved successfully", data: savedOperation });
  } catch (err) {
    res.status(404).json(err.message);
  }
};

let deleteOperation = async (req, res) => {
  let { id } = req.params;
  try {
  
    let operation = await paymentModel.findByIdAndDelete(id);

    if (operation) {
      res
        .status(200)
        .json({ messege: "Operation Deleted successfully" });
    } else {
      res.status(400).json({ message: "Operation not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
let updateOperation = async (req, res) => {

  try {
    let updatedOperation = await paymentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({
      message: "opeation updated successfully",
      data: updatedOperation,
    })
 
  } catch (error) {
    res.json({ message: error.message });
  }
};
module.exports = {
  saveOperation,
  showOperation,
  deleteOperation,
  updateOperation,
};
