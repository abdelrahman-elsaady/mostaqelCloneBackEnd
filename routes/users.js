const express = require('express')
let router = express.Router()
const multer = require('multer');
const path = require('path');
const userModel = require('../models/users');
const sharp = require('sharp');
const fs = require('fs');

let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword ,getUserByEmail ,getUsersByRole,getFreelancers,getClients} = require('../controllers/users')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static/users'))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

const staticDir = path.join(__dirname, '../static/users');
if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
}

router.get('/freelancers', getFreelancers);
router.get('/clients', getClients);
router.get('/role', getUsersByRole);
router.get('/email', getUserByEmail);

router.get('/', getFreelancers);
router.post('/', author, saveUser);

router.get('/:id', getUserByID);
router.delete('/:id', author, deleteUser);
router.patch('/:id', author, upload.single('profilePicture'), updateUser);

router.post('/login', Login);
router.patch('/updatePassword', author, updatePassword);

module.exports=router