const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');





const { getUserPortfolios } = require('../controllers/portfolio'); 
const { createPortfolio } = require('../controllers/portfolio'); 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    return  cb(null, './static/users') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
     return cb(null, `${Date.now()}-${file.originalname}`) // Appending extension
    }
  });
  
  const upload = multer({ storage: storage });
// // GET user's portfolios

router.get('/freelancer/:id', getUserPortfolios);



// // POST new portfolio
router.post('/', upload.single('image'), createPortfolio); 

// // Commented out routes
// // router.get('/', getPortfolio);
// // router.delete('/:id', deletePortfolio);
// // router.patch('/:id', updatePortfolio);

module.exports = router;