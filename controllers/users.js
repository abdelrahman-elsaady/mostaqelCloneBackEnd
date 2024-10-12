const userModel = require("../models/users");
let jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

let showUsers = async (req, res, next) => {
  try {
    let users = await userModel.find().populate('category');
    res.status(200).json({ message: "success", users });
  } catch (err) {
    res.status(404).json(err);
   // next(err)
  }
};

let getUserByID = async (req, res, next) => {
  let { id } = req.params;
  let user = await userModel.findById(id).populate('category').populate('skills');

  try {
    if (user) {
      res.status(200).json({ Message: "User found", data: user });
    }
  } catch (err) {
   next(err);
  }
};

let saveUser = async (req, res) => {
  console.log("Asas");
  try {
    let newUser = req.body;

    const existingUser = await userModel.findOne({ email: newUser.email });

    if (existingUser) {
      return res.status(200).json({ message: "Email already exists" });
    }
    
    console.log(newUser); 
     
    await userModel.create(newUser);
    res.status(200).json({ message: "user saved successfully" });

  } catch (err) {
    // console.log(err);
    res.status(404).json({ message: "failed to save user" });
  }
};

let deleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    
    let User = await userModel.findByIdAndDelete(id);

    if (User) {
      res
        .status(200)
        .json({ messege: "User Deleted successfully"});
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
let updateUser = async (req, res, next) => {
  try {
    let user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "User was edited successfully", user: user });
} catch (err) {
    if (err.name === 'ValidationError') {
        res.status(400).json({ message: "Validation Error", error: err.message });
    } else {
        res.status(404).json({ message: "User not found" });
    }
}
};

let Login = async (req, res) => {
  
  console.log(req.body);
  let { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  let user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  let isvalid = await bcrypt.compare(password, user.password);
  if (!isvalid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }


  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );

  res.status(200).json({token });
};

let updatePassword = async (req, res) => {
  console.log("ss");
  
  let { currentPassword, password } = req.body;
  if (!currentPassword || !password) {
    return res
      .status(400)
      .json({ message: "Please provide current password and new password" });
  }

  let user = await userModel.findById(req.id);
  console.log(user);

  let isvalid = await bcrypt.compare(currentPassword, user.password);
  if (!isvalid) {
    return res.status(400).json({ message: "incorrect password" });
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });

  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );

  res.status(200).json({ token: token });
};

module.exports = {
  saveUser,
  showUsers,
  getUserByID,
  deleteUser,
  updateUser,
  Login,
  updatePassword,
};
