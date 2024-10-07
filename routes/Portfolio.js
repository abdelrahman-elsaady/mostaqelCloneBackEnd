const express = require('express');
const router = express.Router();






const { getUserPortfolios } = require('../controllers/portfolio'); 
const { createPortfolio } = require('../controllers/portfolio'); 

// // GET user's portfolios
router.get('/freelancer/:id', getUserPortfolios);

// // POST new portfolio
router.post('/', createPortfolio);

// // Commented out routes
// // router.get('/', getPortfolio);
// // router.delete('/:id', deletePortfolio);
// // router.patch('/:id', updatePortfolio);

module.exports = router;