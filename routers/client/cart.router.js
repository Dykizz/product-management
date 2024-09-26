const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/cart.controller');

router.get('/',controller.index);

router.post('/add-product',controller.addProduct);

router.delete('/delete-product',controller.deleteProduct);

router.patch('/save',controller.save);

module.exports = router;