const Roles = require('../../models/roles.model');
const configSystem = require('../../config/system');
module.exports.index = async (req, res) => {
    const roles = await Roles.find({ deleted: false });
    res.render('admin/pages/roles.pug', {
        pageTitle: 'Nhóm quyền',
        roles: roles
    });
}
// [GET]  admin/roles/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Roles.findOne({ _id: id });
        res.render('admin/pages/roles/detail.pug', {
            pageTitle: 'Chi tiết nhóm quyền',
            role: role
        });
    } catch (error) {
        res.redirect('back');
        console.log(error)
    }
}
// [GET] admin/roles/edit/:id   
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Roles.findOne({ _id: id });
        res.render('admin/pages/roles/edit.pug', {
            pageTitle: 'Chỉnh sửa nhóm quyền',
            role: role
        });
    } catch (error) {
        res.redirect('back');
    }
}
// [PATCH] admin/roles/edit/:id   
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        await Roles.updateOne({ _id: id }, req.body);
        req.flash('success', 'Cập nhật thông tin thành công!');
        res.redirect(`${configSystem.prefixAdmin}/roles`);

    } catch (error) {
        req.flash('danger', 'Lỗi chỉnh sửa. Vui lòng kiểm tra lại!')
        res.redirect('back');
    }
}

// [DELETE] admin/roles/delete/:id
module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        await Roles.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });
        req.flash('success', 'Xóa thông tin thành công!');
        res.redirect(`${configSystem.prefixAdmin}/roles`);
    } catch (error) {
        req.flash('danger', 'Xóa thông tin không thành công!');
        res.redirect('back');
    }
}
// [GET] admin/roles/create
module.exports.create = (req, res) => {
    res.render('admin/pages/roles/create.pug', {
        pageTitle: "Tạo danh mục"
    })
}

// [POST] admin/roles/create

module.exports.createPost = async (req, res) => {
    try {
        const id = req.params.id;
        if (req.body.title == "") {
            req.flash('waring', 'Hãy nhập tên danh mục!');
            res.redirect('back');
            return;
        }
        const role = new Roles(req.body);
        role.save();
        req.flash('success', 'Tạo danh mục thành công!');
        res.redirect(`${configSystem.prefixAdmin}/roles`);
    } catch (error) {
        req.flash('danger', 'Tạo danh mục không thành công!');
        res.redirect('back');
    }
}

// [GET] admin/roles/permission 
module.exports.permission = async (req, res) => {
    const roles = await Roles.find({ deleted: false })
    res.render('admin/pages/roles/permission.pug',
        {
            pageTitle: "Trang phân quyền",
            roles: roles
        }
    );
}
// [PATCH] admin/roles/permission 
module.exports.permissionPatch = async (req, res) => {
    try {
        const arr = JSON.parse(req.body.groupPermission);
        for (const item of arr) {
            await Roles.updateOne({ _id: item.id }, { permissions: item.permissions });
        }
        req.flash('success','Cập nhật phân quyền thành công!');
    } catch (error) {
        console.log(error);
        req.flash('danger','Cập nhật phân quyền không thành công!');
    }
    res.redirect('back');

}