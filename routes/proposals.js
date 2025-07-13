const express = require("express");
let router = express.Router();
let {author,restrictTo}=require('../middlewares/authorization')
let {
  showProposals,
  saveProposal,
  updateProposalById,
  deleteProposal,
  getProposalsByProjectId,
} = require("../controllers/proposals");

router.get("/", showProposals);
router.get("/project/:id", getProposalsByProjectId);
router.post('/', author, saveProposal);
router.delete('/:id', author, deleteProposal);
router.patch('/:id', author, updateProposalById);

module.exports = router;
