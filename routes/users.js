const express = require('express')
let router = express.Router()
const multer = require('multer');
const path = require('path');
const userModel = require('../models/users');
const sharp = require('sharp');
const fs = require('fs');

let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword ,getUserByEmail ,getUsersByRole} = require('../controllers/users')
// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add this before your routes
const staticDir = path.join(__dirname, '../static/users');
if (!fs.existsSync(staticDir)) {
    fs.mkdirSync(staticDir, { recursive: true });
}

router.get('/role', getUsersByRole);

router.get('/' , showUsers)
router.post('/' , saveUser)
router.get('/email', getUserByEmail)
router.get('/:id' , getUserByID) 
router.delete('/:id',author, deleteUser)

router.patch('/:id' ,upload.single('profilePicture'), updateUser )
router.post ('/login',Login)
router.patch ('/updatePassword',author,updatePassword)

router.patch('/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        if (req.file) {
            // Handle new image upload
            const optimizedImageBuffer = await sharp(req.file.buffer)
                .resize(200, 200, {
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 })
                .toBuffer();

            const filename = `${Date.now()}-${req.file.originalname}`;
            
            // Save physical file
            await sharp(optimizedImageBuffer)
                .toFile(path.join(__dirname, '../static/users', filename));

            // Save to database
            req.body.profilePicture = {
                url: `/static/users/${filename}`,
                data: `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`
            };
        }

        // Update user
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(user);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
});

module.exports=router