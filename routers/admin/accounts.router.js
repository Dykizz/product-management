const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 
const uploadImage = require('../../middleware/admin/uploadImage');
const controller = require('../../controllers/admin/accounts.controller');
const validate = require('../../validates/admin/account.validate');
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});

router.get('/',controller.index);
router.get('/create',controller.create);
router.post('/create',
    upload.single('avatar'),
    validate.createAccount,
    uploadImage,
    controller.createPost);
router.get('/edit/:id',controller.edit);
router.patch('/edit/:id',
    upload.single('avatar'),
    validate.editAccount,
    uploadImage,
    controller.editPatch);
router.delete('/delete/:id',controller.delete);
router.get('/detail/:id',controller.detail);
router.patch('/changeStatus/:status/:id', controller.changeStatus);
module.exports = router;