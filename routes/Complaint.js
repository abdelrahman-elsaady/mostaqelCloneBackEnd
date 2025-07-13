const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaint, deleteComplaint } = require('../controllers/Complaint');
let {author,restrictTo}=require('../middlewares/authorization')

router.post('/', author, createComplaint);
router.get('/', getComplaints);
router.put('/:id', author, updateComplaint);
router.delete('/:id', author, deleteComplaint);

module.exports = router;
