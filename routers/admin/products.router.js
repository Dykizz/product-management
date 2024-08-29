const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 

const controller = require('../../controllers/admin/products.controller')



router.get('/',controller.index);
router.patch('/changeStatus/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);
router.delete('/delete/:id',controller.deleteItem);
router.get('/create',controller.create);

const fileUploadHelper = require('../../helpers/fileUploadHelper');// Hàm cấu hình đường dẫn upload và tên file
const upload = multer({ storage: fileUploadHelper() });
router.post('/create',upload.single('thumbnail'),controller.createPost)
module.exports = router;
