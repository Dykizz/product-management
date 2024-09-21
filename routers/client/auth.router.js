const express = require('express');
const router = express.Router();
const multer  = require('multer');
const controller = require('../../controllers/client/auth.controller');
const uploadImage = require('../../middleware/admin/uploadImage');
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});
router.get('/login',controller.login);

router.post('/login',controller.loginPost);

router.get('/logout',controller.logout);

router.get('/register',controller.register)

router.post('/register',
    upload.single('thumbnail'),
    uploadImage,
    controller.registerPost
)
module.exports = router;