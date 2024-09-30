const express = require('express');
const router = express.Router();

const checkRole = require('../../middleware/admin/checkRole.js');
const controller = require('../../controllers/admin/roles.controller');

router.get('/',
    checkRole('role_detail'),
    controller.index);

router.get('/detail/:id',
    checkRole('role_detail'),
    controller.detail);

router.get('/edit/:id',
    checkRole('role_edit'),
    controller.edit);

router.patch('/edit/:id',
    checkRole('role_edit'),
    controller.editPatch);

router.delete('/delete/:id',
    checkRole('role_delete'),
    controller.delete);

router.get('/create',
    checkRole('role_create'),
    controller.create);

router.post('/create',
    checkRole('role_create'),
    controller.createPost);

router.get('/permission',
    checkRole('role_permission'),
    controller.permission);

router.patch('/permission',
    checkRole('role_permission'),
    controller.permissionPatch);

module.exports = router;