const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 
const uploadImage = require('../../middleware/admin/uploadImage');
const checkRole = require('../../middleware/admin/checkRole.js');
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});

const controller = require('../../controllers/admin/categories.controller');

router.get('/',
    checkRole('category_detail'),
    controller.index);

router.patch('/changeStatus/:status/:id', 
    checkRole('category_edit'),
    controller.changeStatus);

router.get('/create',
    checkRole('category_create'),
    controller.create);

router.post('/create',
    checkRole('category_create'),
    upload.single('thumbnail'),
    uploadImage,
    controller.createPost
)

router.delete('/delete/:id',
    checkRole('category_delete'),
    controller.delete);

router.get('/detail/:id',
    checkRole('category_detail'),
    controller.detail);

router.get('/edit/:id',
    checkRole('category_edit'),
    controller.edit);

router.patch('/edit/:id',
    checkRole('category_edit'),
    controller.editPatch);

router.patch('/change-multi',
    checkRole('category_edit'),
    controller.changeMulti);

module.exports = router;