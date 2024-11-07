const express = require("express");
let router = express.Router();

// let {author,restrictTo}=require('../middlewares/authorization')

let {
  showProposals,
  saveProposal,
  updateProposalById,
  deleteProposal,
  getProposalsByProjectId,
} = require("../controllers/proposals");

router.get("/", showProposals);
router.get("/project/:id", getProposalsByProjectId);
router.post("/", saveProposal);
router.delete("/:id", deleteProposal);
 
router.patch("/:id", updateProposalById);

module.exports = router;
