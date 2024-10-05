const express = require('express')
let router = express.Router()
let {author,restrictTo}=require('../middlewares/authorization')

let {showReviews , saveReviews,deleteReviews,updatereviewsById,getUserReviews} = require('../controllers/reviews')

router.get('/' , showReviews)
router.post('/' ,author,restrictTo("client"), saveReviews)
router.delete('/:id' , restrictTo("client"),deleteReviews)
router.patch('/:id' ,restrictTo("client"), updatereviewsById)
router.get('/:userId', getUserReviews);


module.exports=router