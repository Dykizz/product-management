const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/setting.controller');

const multer = require('multer');// Thư viện upload file
const uploadImage = require('../../middleware/admin/uploadImage');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/general', controller.general);

router.patch('/general', 
    upload.single('logo'),
    uploadImage,
    controller.general_PATCH
);

module.exports = router;