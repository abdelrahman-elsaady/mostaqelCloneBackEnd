const express = require("express");
let router = express.Router();
let {author,restrictTo}=require('../middlewares/authorization')


let {
  saveCategories,
  showCategories,
  deleteCategories,
  updateCategoriesById,
} = require("../controllers/categories");

router.get("/",showCategories);
router.post("/", author,  saveCategories);
router.delete("/:id", deleteCategories);
router.patch("/:id", updateCategoriesById);

module.exports = router;
