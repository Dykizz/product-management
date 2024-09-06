const Account = require('../../models/account.model');
const Roles = require('../../models/roles.model');
const configSystem = require('../../config/system');
const md5 = require('md5');
// [GET] admin/accounts
module.exports.index = async (req,res) => {
    try {
        const accounts = await Account.find({deleted : false},"-password -token");
        res.render('admin/pages/accounts/index',{
            pageTitle : 'Danh sách tài khoản',
            accounts : accounts
        });
    } catch (error) {
        res.flash('danger','Lỗi truy cập!');
        res.redirect('back');
    }
    
}

// [GET] admin/accounts/create
module.exports.create = async (req,res) => {
    try {
        const roles = await Roles.find({deleted : false});
        res.render('admin/pages/accounts/create.pug',{
            pageTitle : 'Tạo tài khoản',
            roles : roles
        });
    } catch (error) {
        res.flash('danger','Lỗi truy cập!');
        res.redirect('back');
    }
}

// [POST] admin/accounts/create
module.exports.createPost = async (req,res) =>{
    try{
        const existEmail = await Account.findOne({email : req.body.email});
        if (!!existEmail){
            console.log(existEmail)
            res.flash('warning','Email này đã tồn tại');
            res.redirect('back');
            return;
        }
        const existPhone = await Account.findOne({ phone : req.body.phone });
        if (!!existPhone){
            res.flash('warning','Số điện thoại này đã tồn tại');
            res.redirect('back');
            return;
        }
        req.body.password = md5(req.body.password);
        const account = new Account(req.body);
        account.save();
        res.flash('success','Tạo tài khoản thành công!');
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
    }catch(error){
        res.dange('danger','Lỗi không tạo được tài khoản!');
        res.redirect('back');
    }
    
}

// [GET] admin/accounts/edit:id 
module.exports.edit =async (req,res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne({_id : id});
        const roles = await Roles.find({deleted : false});
        res.render('admin/pages/accounts/edit',{
            pageTitle: 'Chỉnh sửa tài khoản',
            account : account,
            roles : roles
        })
    } catch (error) {
        res.flash('danger','Lỗi đường dẫn không tồn tại!');
        res.redirect('back');
    }
}
// [PATCH] admin/accounts/edit/:id
module.exports.editPatch = async (req,res) => {
    try {
        if (req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }
        const id = req.params.id ;
        const existEmail = await Account.findOne({
            _id : { $ne : id},
            email : req.body.email,
            deleted : false
        })
        if (existEmail){
            res.flash('warning','Email này đã tồn tại!');
            res.redirect('back');
            return;
        }
        const existPhone = await Account.findOne({
            _id : { $ne : id },
            phone : req.body.phone,
            deleted : false
        })
        if (existPhone){
            res.flash('warning','Số điện thoại này đã tồn tại!');
            res.redirect('back');
            return;
        }
        await Account.updateOne({_id : id},req.body);
        res.flash('success','Chỉnh sửa tài khoản thành công!');
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
    } catch (error) {
        res.flash('danger','Chỉnh sửa không thành công!');
        res.redirect('back');
    }
}

// [DELETE] admin/accounts/delete/:id
module.exports.delete = async (req,res) =>{
    try {
        const id = req.params.id;
        await Account.updateOne({ _id : id }, {deleted : true});
        res.flash('success','Xóa tài khoản thành công!')
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
    } catch (error) {
        res.flash('danger','Xóa tài khoản không thành công!')
        res.redirect('back');
    }
}

// [GET] admin/accounts/detail/:id
module.exports.detail = async (req,res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne({_id : id });
        const roles = await Roles.findOne({_id : account.role_id });
        if (account.createdAt) account.timeCreate = account.createdAt.toLocaleString();
        res.render('admin/pages/accounts/detail',{
            pageTitle : 'Chi tiết tài khoản',
            account : account ,
            roles : roles
        })
    } catch (error) {
        res.flash('danger','Lỗi truy cập!');
        res.redirect('back');
    }
}

// [PACTH] /admin/accounts/changeStatus/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;
        const currentStatus = status == "active" ? "inactive" : "active";
        await Account.updateOne({ _id: id }, { status: currentStatus });
        req.flash('success', 'Cập nhật trạng thái tài khoản thành công!');
        res.redirect("back");
    } catch (error) {
        res.redirect("back");
    }
    
}