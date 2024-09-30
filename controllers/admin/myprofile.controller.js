const Account = require('../../models/account.model');

module.exports.index = async (req,res) => {
    
    const id = res.locals.user._id;
    const account = await Account.findOne({ _id : id},"-password");
    res.render('admin/pages/myprofile/index.pug',{
        pageTitle : "My Profile",
        account : account,
    })
}

module.exports.edit = async (req,res) => {
    const id = res.locals.user._id;
    const account = await Account.findOne({ _id : id},"-password");
    res.render('admin/pages/myprofile/edit.pug',{
        pageTitle : "Chỉnh sửa profile",
        account : account
    })
}

module.exports.editPatch = async (req,res) => {
    try {
        if (req.body.password){
            req.body.password = md5(req.body.password);
        }else{
            delete req.body.password;
        }
        const id = res.locals.id ;
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
        req.flash('success','Chỉnh sửa thông tin thành công!');
        res.redirect(`${configSystem.prefixAdmin}/myprofile`);
    } catch (error) {
        console.log(error)
        req.flash('danger','Chỉnh sửa không thành công!');
        res.redirect('back');
    }
}