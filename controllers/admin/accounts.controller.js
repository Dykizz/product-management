const Account = require('../../models/account.model');
const Roles = require('../../models/roles.model');
const configSystem = require('../../config/system');
const md5 = require('md5');
// [GET] admin/accounts
module.exports.index = async (req,res) => {
    try {
        const id = res.locals.user._id;
        const accounts = await Account.find({deleted : false , _id : { $ne : id}},"-password -token");
        res.render('admin/pages/accounts/index',{
            pageTitle : 'Danh sách tài khoản',
            accounts : accounts
        });
    } catch (error) {
        console.log(error);
        req.flash('danger','Lỗi truy cập!');
        res.redirect('back');
    }
    
}

// [GET] admin/accounts/create
module.exports.create = async (req,res) => {
    try {
        res.render('admin/pages/accounts/create.pug',{
            pageTitle : 'Tạo tài khoản',
        });
    } catch (error) {
        req.flash('danger','Lỗi truy cập!');
        res.redirect('back');
    }
}

// [POST] admin/accounts/create
module.exports.createPost = async (req,res) =>{
    try{
        const existEmail = await Account.findOne({email : req.body.email});
        if (!!existEmail){
            req.flash('warning','Email này đã tồn tại');
            res.redirect('back');
            return;
        }
        const existPhone = await Account.findOne({ phone : req.body.phone });
        if (!!existPhone){
            req.flash('warning','Số điện thoại này đã tồn tại');
            res.redirect('back');
            return;
        }
        req.body.password = md5(req.body.password);
        const account = new Account(req.body);
        account.save();
        req.flash('success','Tạo tài khoản thành công!');
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
    }catch(error){
        req.flash('danger','Lỗi không tạo được tài khoản!');
        res.redirect('back');
    }
    
}

// [GET] admin/accounts/edit:id 
module.exports.edit =async (req,res) => {
    try {
        const id = req.params.id; 
        const account = await Account.findOne({_id : id});  
        res.render('admin/pages/accounts/edit',{
            pageTitle: 'Chỉnh sửa tài khoản',
            account : account
        })
    } catch (error) {
        req.flash('danger','Lỗi đường dẫn không tồn tại!');
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
            req.flash('warning','Email này đã tồn tại!');
            res.redirect('back');
            return;
        }
        const existPhone = await Account.findOne({
            _id : { $ne : id },
            phone : req.body.phone,
            deleted : false
        })
        if (existPhone){
            req.flash('warning','Số điện thoại này đã tồn tại!');
            res.redirect('back');
            return;
        }
        await Account.updateOne({_id : id},req.body);
        req.flash('success','Chỉnh sửa tài khoản thành công!');
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
    } catch (error) {
        req.flash('danger','Chỉnh sửa không thành công!');
        res.redirect('back');
    }
}

// [DELETE] admin/accounts/delete/:id
module.exports.delete = async (req,res) =>{
    try {
        const id = req.params.id;
        await Account.updateOne({ _id : id }, {deleted : true});
        req.flash('success','Xóa tài khoản thành công!')
        res.redirect(`${configSystem.prefixAdmin}/accounts`);
    } catch (error) {
        req.flash('danger','Xóa tài khoản không thành công!')
        res.redirect('back');
    }
}

// [GET] admin/accounts/detail/:id
module.exports.detail = async (req,res) => {
    try {
        const id = req.params.id;
        const account = await Account.findOne({_id : id });
        if (account.createdAt) account.timeCreate = account.createdAt.toLocaleString();
        res.render('admin/pages/accounts/detail',{
            pageTitle : 'Chi tiết tài khoản',
            account : account ,
        })
    } catch (error) {
        req.flash('danger','Lỗi truy cập!');
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