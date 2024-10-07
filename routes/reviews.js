const express = require('express')
let router = express.Router()
let {author,restrictTo}=require('../middlewares/authorization')

let {showReviews , saveReviews,deleteReviews,updatereviewsById,getUserReviews} = require('../controllers/reviews')
 let {getFreelancerReviews}=require('../controllers/freelancerReviews/reviews')
 let {createRandomReview}=require('../controllers/freelancerReviews/GinRandomRev')


router.get('/freelancer/:id', getFreelancerReviews);
router.get('/' , showReviews)
router.post('/' , saveReviews)
router.delete('/:id' , restrictTo("client"),deleteReviews)
router.patch('/:id' ,restrictTo("client"), updatereviewsById)
router.get('/:userId', getUserReviews);

router.post('/random', createRandomReview);

module.exports=router