const express = require('express');
const router = express.Router();
const multer  = require('multer');
const controller = require('../../controllers/client/user.controller');
const uploadImage = require('../../middleware/admin/uploadImage');
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});
router.get('/login',controller.login);

router.post('/login',controller.loginPost);

router.get('/logout',controller.logout);

router.get('/register',controller.register);

router.post('/register',
    upload.single('thumbnail'),
    uploadImage,
    controller.registerPost
);

router.get('/forget',controller.forget);

router.post('/forget',controller.forget_POST);

router.get('/forget/comfirm-otp',controller.comfirmOTP);

router.post('/forget/comfirm-otp',controller.comfirmOTP_POST);

router.get('/reset-password',controller.resetPassword);

router.post('/reset-password',controller.resetPassword_POST);
module.exports = router;