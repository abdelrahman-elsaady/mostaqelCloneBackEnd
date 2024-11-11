const express = require('express')
let router = express.Router()
const multer = require('multer');
const path = require('path');
const userModel = require('../models/users');
const sharp = require('sharp');
const fs = require('fs');

let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword ,getUserByEmail ,getUsersByRole,getFreelancers,getClients} = require('../controllers/users')
// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../static/users'))
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const upload = multer({ storage: storage });

// Add this before your routes
const staticDir = path.join(__dirname, '../static/users');
if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
}

router.get('/freelancers', getFreelancers);
router.get('/clients', getClients);
router.get('/role', getUsersByRole);
router.get('/email', getUserByEmail);

router.get('/', showUsers);
router.post('/', saveUser);

router.get('/:id', getUserByID);
router.delete('/:id', author, deleteUser);
router.patch('/:id', upload.single('profilePicture'), updateUser);

router.post('/login', Login);
router.patch('/updatePassword', author, updatePassword);

router.patch('/:id', upload.single('profilePicture'), async (req, res) => {
    try {

        console.log("aboooooooooooooooda");
        if (req.file) {
            // Update the profile picture path
            req.body.profilePicture = `/static/users/${req.file.filename}`;
        }

        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

module.exports=router