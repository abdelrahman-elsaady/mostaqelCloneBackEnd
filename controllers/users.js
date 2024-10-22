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

let getUserByEmail = async (req, res, next) => {
  let { email } = req.body;
  console.log(email);
  try{
  let user = await userModel.findOne({ email: email });

  res.status(200).json({ message: "success", user });
} catch (err) {
  next(err);
}
};

let getUserByID = async (req, res, next) => {
  let { id } = req.params;
  // console.log("aboda");

  let user = await userModel.findById(id).populate('category').populate('skills').populate('portfolio') .populate({
    path: 'proposals',
    populate: {
      path: 'project',
      populate: {
        path: 'client',
      }
    }
  });

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
  console.log(req.body);
  try {
    let newUser = req.body;

    const existingUser = await userModel.findOne({ email: newUser.email });

    if (existingUser) {
      return res.status(200).json({ message: "Email already exists" });
    }
    
    
       const user = await userModel.create(newUser);

    res.status(200).json({ message: "user saved successfully" , user});
    // console.log(newUser); 

  } catch (err) {
    console.log(err);
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
  console.log("aboda");
  try {
    let updates = req.body;
    console.log(updates);
    if (req.file) {
      updates.profilePicture = req.file.filename;
    }

    
    if (updates.skills) {
      updates.skills = JSON.parse(updates.skills);
    }
    let user = await userModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.status(200).json({ message: "User was edited successfully", user: user });
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
  console.log(password);
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  let user = await userModel.findOne({ email: email });
  // console.log(user);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  let isvalid = await bcrypt.compare(password, user.password);
  console.log(isvalid);
  
  if (!isvalid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }


  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );
console.log(token);
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
  getUserByEmail
};
