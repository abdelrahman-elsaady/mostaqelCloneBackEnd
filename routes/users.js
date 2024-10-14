const express = require('express')
let router = express.Router()
const multer = require('multer');
const path = require('path');
let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword } = require('../controllers/users')
// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './static') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) // Appending extension
    }
  });
  
  const upload = multer({ storage: storage });
router.get('/' , showUsers)
router.post('/' , saveUser)
router.get('/:id' , getUserByID) 
router.delete('/:id',author, deleteUser)

router.patch('/:id' ,upload.single('profilePicture'), updateUser )
router.post ('/login',Login)
router.patch ('/updatePassword',author,updatePassword)
 
  


module.exports=router