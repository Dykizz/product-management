const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/users.controller');

router.get('/not-friend',controller.notFriend);
router.get('/send-friend',controller.sendFriend)
router.get('/request-friend',controller.requestFriend);
router.get('/friends',controller.friends);
module.exports = router;