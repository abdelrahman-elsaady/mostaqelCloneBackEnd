const express = require('express');
const router = express.Router();
const {createProject , getProjects  , updateProject , deleteProject , getProjectById, saveProposal, getProjectsByClient, acceptProposal} = require('../controllers/project');
// const { protect } = require('../middleware/authMiddleware'); // Middleware to protect routes

let {author,restrictTo}=require('../middlewares/authorization')

router.post('/', createProject);

router.get('/', getProjects);


router.post('/accept-proposal', acceptProposal);



router.get('/client/:id', getProjectsByClient);


router.post('/proposals/:id', saveProposal);

router.patch('/:id', updateProject);
router.get('/:id', getProjectById);


router.delete('/:id',deleteProject);

module.exports = router;
