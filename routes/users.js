const express = require('express')
let router = express.Router()

let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword } = require('../controllers/users')

router.get('/' , showUsers)
router.post('/' , saveUser)
router.get('/:id' , getUserByID)
router.delete('/:id',author, deleteUser)
router.patch('/:id' , author,updateUser)
router.post ('/login',Login)
router.patch ('/updatePassword',author,updatePassword)



module.exports=router