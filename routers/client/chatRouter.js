const express = require('express');
const router = express.Router();
const chatMiddleware = require('../../middleware/client/chat.middleware');
const controller = require('../../controllers/client/chat.controller');
router.get('/:id',chatMiddleware,controller.index);

module.exports = router;