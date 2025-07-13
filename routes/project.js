const express = require('express');
const router = express.Router();
const {createProject , getProjects  , updateProject , deleteProject , getProjectById, saveProposal, getProjectsByClient, acceptProposal} = require('../controllers/project');
let {author,restrictTo}=require('../middlewares/authorization')

router.post('/', author, createProject);
router.get('/', getProjects);
router.post('/accept-proposal', author, acceptProposal);
router.get('/client/:id', author, getProjectsByClient);
router.post('/proposals/:id', author, saveProposal);
router.patch('/:id', author, updateProject);
router.get('/:id', getProjectById);
router.delete('/:id', author, deleteProject);

module.exports = router;
