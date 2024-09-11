const express = require("express");
const multer  = require('multer');// Thư viện upload file
const router = express.Router(); 
const uploadImage = require('../../middleware/admin/uploadImage');

const storage = multer.memoryStorage();
const upload = multer({ storage : storage});

const controller = require('../../controllers/admin/categories.controller');
router.get('/',controller.index);

router.patch('/changeStatus/:status/:id', controller.changeStatus);

router.get('/create',controller.create);
router.post('/create',
    upload.single('thumbnail'),
    uploadImage,
    controller.createPost
)

router.delete('/delete/:id',controller.delete);

router.get('/detail/:id',controller.detail);

router.get('/edit/:id',controller.edit);
router.patch('/edit/:id',controller.editPatch);
router.patch('/change-multi',controller.changeMulti);
module.exports = router;