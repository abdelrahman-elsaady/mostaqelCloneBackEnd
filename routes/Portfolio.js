const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getUserPortfolios, createPortfolio } = require('../controllers/portfolio');
let {author,restrictTo}=require('../middlewares/authorization')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './static/users')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
});
const upload = multer({ storage: storage });

router.get('/freelancer/:id', getUserPortfolios);
router.post('/', author, upload.single('image'), createPortfolio);

module.exports = router;