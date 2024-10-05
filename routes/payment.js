const express = require('express')
let router = express.Router()

let {author,restrictTo}=require('../middlewares/authorization')

let {saveOperation , showOperation , deleteOperation , updateOperation} = require('../controllers/payment')

router.get('/' , showOperation)
router.post('/' , saveOperation)
router.delete('/:id' , deleteOperation)
router.patch('/:id' , updateOperation)


module.exports=router