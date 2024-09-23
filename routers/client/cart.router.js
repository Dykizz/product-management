const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/cart.controller');

router.post('/add-product',controller.addProduct);

router.delete('/delete-product',controller.deleteProduct);

module.exports = router;