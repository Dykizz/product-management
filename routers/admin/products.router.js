const express = require("express");
const router = express.Router(); 
const controller = require('../../controllers/admin/products.controller')

router.get('/',controller.index);
router.patch('/changeStatus/:status/:id', controller.changeStatus);
router.patch('/change-multi', controller.changeMulti);

module.exports = router;
