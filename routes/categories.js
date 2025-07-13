

const express = require("express");
let router = express.Router();
let {author,restrictTo}=require('../middlewares/authorization')
let {
  saveCategories,
  showCategories,
  deleteCategories,
  updateCategoriesById,
} = require("../controllers/categories");

router.get("/", showCategories);
router.post('/', author, restrictTo('admin'), saveCategories);
router.delete('/:id', author, restrictTo('admin'), deleteCategories);
router.patch('/:id', author, restrictTo('admin'), updateCategoriesById);

module.exports = router;
