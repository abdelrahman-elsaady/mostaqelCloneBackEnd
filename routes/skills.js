

const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skills');
let {author,restrictTo}=require('../middlewares/authorization')

router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);
router.post('/', author, restrictTo('admin'), skillController.createSkill);
router.patch('/:id', author, restrictTo('admin'), skillController.updateSkill);
router.delete('/:id', author, restrictTo('admin'), skillController.deleteSkill);

module.exports = router;