const express = require('express');
const multer  = require('multer');// Thư viện upload file
const router = express.Router();
const controller = require('../../controllers/client/users.controller');
const uploadImage = require('../../middleware/admin/uploadImage');

const storage = multer.memoryStorage();
const upload = multer({ storage : storage});

router.get('/not-friend',controller.notFriend);
router.get('/send-friend',controller.sendFriend)
router.get('/request-friend',controller.requestFriend);
router.get('/friends',controller.friends);
router.get('/rooms-chat',controller.rooms_chat);
router.get('/create-room-chat',controller.create_room_chat);
router.post('/create-room-chat',
    upload.single('avarta'),
    uploadImage,
    controller.create_room_chatPost);
module.exports = router;