const express = require('express');
const router = express.Router();
const {createComplaint , getComplaints  , updateComplaint , deleteComplaint } = require('../controllers/Complaint');

let {author,restrictTo}=require('../middlewares/authorization')

router.post('/',createComplaint);

router.get('/',getComplaints);



router.patch('/:id', updateComplaint);

router.delete('/:id',deleteComplaint);

module.exports = router;
