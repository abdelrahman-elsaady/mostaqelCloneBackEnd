const express = require('express');
const router = express.Router();
const {createProject , getProjects  , updateProject , deleteProject , getProjectById, saveProposal} = require('../controllers/project');
// const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

let {author,restrictTo}=require('../middlewares/authorization')

router.post('/', createProject);

router.get('/', getProjects);

router.post('/proposals/:id', saveProposal);

router.patch('/:id', updateProject);
router.get('/:id', getProjectById);


router.delete('/:id',deleteProject);

module.exports = router;
