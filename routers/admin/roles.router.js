const express = require('express');
const router = express.Router();

const controller = require('../../controllers/admin/roles.controller')
router.get('/',controller.index);
router.get('/detail/:id',controller.detail);
router.get('/edit/:id',controller.edit);
router.patch('/edit/:id',controller.editPatch);
router.delete('/delete/:id',controller.delete);
router.get('/create',controller.create);
router.post('/create',controller.createPost);
router.get('/permission',controller.permission);

router.patch('/permission',controller.permissionPatch);
module.exports = router;