const express = require('express')
let router = express.Router()
const multer = require('multer');
const path = require('path');
const userModel = require('../models/users');

let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword ,getUserByEmail ,getUsersByRole} = require('../controllers/users')
// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    return  cb(null, './static/users') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
     return cb(null, `${Date.now()}-${file.originalname}`) // Appending extension
    }
  });
  
  const upload = multer({ storage: storage });
  router.get('/role', getUsersByRole);

router.get('/' , showUsers)
router.post('/' , saveUser)
router.get('/email', getUserByEmail)
router.get('/:id' , getUserByID) 
router.delete('/:id',author, deleteUser)

router.patch('/:id' ,upload.single('profilePicture'), updateUser )
router.post ('/login',Login)
router.patch ('/updatePassword',author,updatePassword)
 
  


module.exports=router