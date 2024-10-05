const express = require('express');
const router = express.Router();
let {author,restrictTo}=require('../middlewares/authorization')

const {getAdmins  , getAdminById , updateAdmin , deleteAdmin , registerAdmin , loginAdmin } = require('../controllers/Admin');
// const { protect } = require('../middleware/authMiddleware');
// Register a new admin
router.post('/register', registerAdmin);

// Login an admin
router.post('/login',loginAdmin);

// Get all admins
router.get('/', getAdmins);

// Get a single admin by ID
router.get('/:id', getAdminById);

// Update an admin
router.put('/:id',author,restrictTo("admin"), updateAdmin);

// Delete an admin
router.delete('/:id',author,restrictTo("admin") ,deleteAdmin);

module.exports = router;
