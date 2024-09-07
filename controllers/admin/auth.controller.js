const Account = require('../../models/account.model');
const configSystem = require('../../config/system');
const md5 = require('md5');

// [GET] admin/auth/login
module.exports.login = (req,res) => {
    res.render('admin/pages/auth/login.pug',{
        pageTitle : 'Đăng nhập'
    })
}

// [POST] admin/auth/login
module.exports.loginPost = async (req,res) => {
    let {email , password } = req.body;
    password = md5(password);
    const account = await Account.findOne({ email : email, password : password});
    if (!account) {
        res.flash('danger','Tài khoản hoặc mật khẩu không chính xác!');
        return res.redirect('back');
    }
    if ( account.status == "inactive") {
        req.flash('danger','Tài khoản này hiện đang bị khóa!');
        return res.redirect('back');
    }
    res.cookie('token',account.token);
    req.flash('success','Đăng nhập tài khoản thành công!');
    res.redirect(`${configSystem.prefixAdmin}/dashboard`);
}
// [GET] admin/auth/logout
module.exports.logout = (req,res) => {
    res.clearCookie('token');
    res.redirect(`${configSystem.prefixAdmin}/auth/login`);
}