const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 
const checkRole = require('../../middleware/admin/checkRole.js');
const controller = require('../../controllers/admin/products.controller')
const validate = require('../../validates/admin/product.validate');
const uploadImage = require('../../middleware/admin/uploadImage');

router.get('/',controller.index);
router.patch('/changeStatus/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id',controller.deleteItem);
router.get('/create',controller.create); 

// Upload
const fileUploadHelper = require('../../helpers/fileUploadHelper');// Hàm cấu hình đường dẫn upload và tên file cho local
const storage = multer.memoryStorage();
const upload = multer({ storage : storage});
//End Upload

router.post('/create',
    checkRole('product_create'),
    upload.single('thumbnail'),
    validate.createPost,
    uploadImage,
    controller.createPost);

router.get('/edit/:id',
    checkRole('product_edit'),
    controller.edit);

router.patch('/edit/:id',
    checkRole('product_edit'),
    upload.single('thumbnail'),
    validate.createPost,
    uploadImage,
    controller.editPatch
);

router.get('/detail/:id',
    checkRole('product_detail'),
    controller.detail);

module.exports = router;
