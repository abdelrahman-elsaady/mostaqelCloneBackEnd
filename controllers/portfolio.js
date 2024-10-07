







const User = require('../models/users');

const Portfolio = require('../models/portfolio');

let createPortfolio = async (req, res) => {
  try {
    const { title, description, image, freelancerId } = req.body;

    const newPortfolio = new Portfolio({
      title,
      description,
      image,
      freelancerId
    });

    const savedPortfolio = await newPortfolio.save();

    await User.findByIdAndUpdate(freelancerId, {
        $push: { portfolio: savedPortfolio._id }
      });

    res.status(201).json(savedPortfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


let getUserPortfolios = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('portfolio');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.portfolio);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
  
  
};



module.exports={createPortfolio,getUserPortfolios}