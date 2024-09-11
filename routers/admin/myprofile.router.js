const express = require("express");
const router = express.Router(); 
const multer  = require('multer');// Thư viện upload file
const uploadImage = require('../../middleware/uploadImage');
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});
const controller = require('../../controllers/admin/myprofile.controller');
const validate = require('../../validates/admin/account.validate');
router.get('/',controller.index);

router.get('/edit',controller.edit);

router.patch('/edit',
    upload.single('avatar'),
    validate.editAccount,
    uploadImage,
    controller.editPatch)

module.exports = router;