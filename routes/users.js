const express = require('express')
let router = express.Router()
const multer = require('multer');
const path = require('path');
const userModel = require('../models/users');
const sharp = require('sharp');

let {author,restrictTo}=require('../middlewares/authorization')

let {saveUser , showUsers , getUserByID , deleteUser , updateUser ,  Login ,updatePassword ,getUserByEmail ,getUsersByRole} = require('../controllers/users')
// Configure multer for file upload
const storage = multer.memoryStorage();
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

router.patch('/:id', upload.single('profilePicture'), async (req, res) => {
    try {
        if (req.file) {
            // Resize and compress image
            const optimizedImageBuffer = await sharp(req.file.buffer)
                .resize(200, 200, { // Resize to reasonable profile picture size
                    fit: 'cover',
                    position: 'center'
                })
                .jpeg({ quality: 80 }) // Convert to JPEG with 80% quality
                .toBuffer();

            // Convert to base64 for database storage
            const optimizedBase64 = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;

            // Generate filename and save physical file
            const filename = `${Date.now()}-${req.file.originalname}`;
            await sharp(optimizedImageBuffer)
                .toFile(path.join('./static/users', filename));

            // Save both URL and optimized base64 to database
            req.body.profilePicture = {
                url: `/static/users/${filename}`,
                data: optimizedBase64
            };
        }

        // Update user logic...
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(user);
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).json({ message: 'Error updating user' });
    }
});

module.exports=router