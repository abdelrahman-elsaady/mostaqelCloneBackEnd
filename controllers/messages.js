const messageModel = require("../models/messages");

let showMessages = async (req, res) => {
  try {
    let Messages = await messageModel.find();
    res.status(200).json({ message: "success", Messages });
  } catch (err) {
    res.status(404).json(err);
  }
};

let saveMessage = async (req, res) => {
  let newMessage = req.body;
  try {
    let saveMessage = await messageModel.create(newMessage);
    res
      .status(200)
      .json({ message: "Message saved successfully", data: saveMessage });
  } catch (err) {
    res.status(404).json(err.message);
  }
};

let deleteMessage = async (req, res) => {
  let { id } = req.params;
  try {
    let Message = await messageModel.findByIdAndDelete(id);
    if (Message) {
      res
        .status(200)
        .json({ messege: "Message Deleted successfully"});
    } else {
      res.status(400).json({ message: "Message not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
let updateMessage = async (req, res) => {

  try {
    let UpdatedMessage = await messageModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({message: "Message updated successfully", UpdatedMessage});

  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = { saveMessage, showMessages, deleteMessage, updateMessage };
