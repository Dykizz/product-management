const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/roles.controller')
router.get('/',controller.index);
router.get('/detail/:id',controller.detail);
router.get('/edit/:id',controller.edit);
router.patch('/edit/:id',controller.editPatch);
router.delete('/delete/:id',controller.delete);
module.exports = router;