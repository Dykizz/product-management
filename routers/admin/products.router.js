const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 

const controller = require('../../controllers/admin/products.controller')
const validate = require('../../validates/admin/product.validate');
const uploadImage = require('../../middleware/uploadImage');

router.get('/',controller.index);
router.patch('/changeStatus/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id',controller.deleteItem);
router.get('/create',controller.create);

const fileUploadHelper = require('../../helpers/fileUploadHelper');// Hàm cấu hình đường dẫn upload và tên file cho local
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});
router.post('/create',
    upload.single('thumbnail'),
    validate.createPost,
    uploadImage,
    controller.createPost);

router.get('/edit/:id',controller.edit);
router.patch('/edit/:id',
    upload.single('thumbnail'),
    validate.createPost,
    uploadImage,
    controller.editPatch
);
router.get('/detail/:id',controller.detail);

module.exports = router;
