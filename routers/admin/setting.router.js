const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/setting.controller');
const checkRole = require('../../middleware/admin/checkRole.js');

const multer = require('multer');// Thư viện upload file
const uploadImage = require('../../middleware/admin/uploadImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/general', 
    checkRole('setting-general_detail'),
    controller.general);

router.patch('/general',
    checkRole('setting-general_detail'),
    upload.single('logo'),
    uploadImage,
    controller.general_PATCH
);

module.exports = router;