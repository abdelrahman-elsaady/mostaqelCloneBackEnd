const express = require('express');
const router = express.Router();
let {author,restrictTo}=require('../middlewares/authorization')
const { getAdmins, getAdminById, updateAdmin, deleteAdmin, addAdmin, loginAdmin } = require('../controllers/Admin');

router.post('/register', addAdmin);
router.post('/login', loginAdmin);
router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.put('/:id', author, restrictTo('admin'), updateAdmin);
router.delete('/:id', author, restrictTo('admin'), deleteAdmin);

module.exports = router;
