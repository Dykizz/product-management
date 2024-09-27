const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/checkout.controller');

router.get('/', controller.index);

router.post('/order',controller.order);
 
module.exports = router;