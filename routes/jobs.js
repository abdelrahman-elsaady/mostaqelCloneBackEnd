const express = require('express')
let router = express.Router()

let {author,restrictTo}=require('../middlewares/authorization')

let {showJobs , saveJob ,deleteJob, updateJob}= require('../controllers/jobs')

router.get('/' , showJobs)
router.post('/' , saveJob)
router.delete('/:id' , deleteJob)
router.patch('/:id' , updateJob)


module.exports=router