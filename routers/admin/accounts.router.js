const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 
const checkRole = require('../../middleware/admin/checkRole.js');
const uploadImage = require('../../middleware/admin/uploadImage');
const controller = require('../../controllers/admin/accounts.controller');
const validate = require('../../validates/admin/account.validate');
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});

router.get('/',
    checkRole('account_detail'),
    controller.index);

router.get('/create',
    checkRole('account_create'),
    controller.create);

router.post('/create',
    checkRole('account_create'),
    upload.single('avatar'),
    validate.createAccount,
    uploadImage,
    controller.createPost);

router.get('/edit/:id',
    checkRole('account_edit'),
    controller.edit);

router.patch('/edit/:id',
    checkRole('account_edit'),
    upload.single('avatar'),
    validate.editAccount,
    uploadImage,
    controller.editPatch);

router.delete('/delete/:id',
    checkRole('account_delete'),
    controller.delete);

router.get('/detail/:id',
    checkRole('account_detail'),
    controller.detail);

router.patch('/changeStatus/:status/:id', 
    checkRole('account_edit'),
    controller.changeStatus);

module.exports = router;