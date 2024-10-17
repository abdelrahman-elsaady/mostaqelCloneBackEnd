


const express = require('express');

const router = express.Router();

const messageController = require('../controllers/messages');

router.post('/', messageController.sendMessage);
router.get('/:conversationId', messageController.getMessages);

module.exports = router;












// const express = require('express')
// let router = express.Router()
// let {author,restrictTo}=require('../middlewares/authorization')


// let {saveMessage , showMessages , deleteMessage, updateMessage } = require('../controllers/messages')



// router.get('/' , showMessages)
// router.post('/' , saveMessage)
// router.delete('/:id' , deleteMessage)
// router.patch('/:id' , updateMessage)



// module.exports=router